from playwright.sync_api import sync_playwright
import db
import scraper
import processor
import time

def main():
    # 1. 通知库房做好准备
    db.init_db()
    # 2. 设定我们的终极目标
    TARGET_TOTAL = 30       # 目标数量：50 个项目
    total_scraped = 0       # 计数器：目前抓成功了几个
    current_page = 1        # 翻页器：当前在第几页

    # ArchDaily 所有项目列表的基础网址
    base_url = "https://www.archdaily.com/search/projects"
    # # 2. 确定今天的目标 (只测试一个页面)
    # target_urls = [
    #     "https://www.archdaily.com/1039308/hotel-myeongdong-station-yong-ju-lee-architecture"
    # ]
    
    # 3. 启动自动化流水线
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True) 
        page = browser.new_page()
        
        while total_scraped < TARGET_TOTAL:
            print(f"\n====== scanning {current_page}=======")

            if current_page==1:
                list_url=base_url
            else:
                list_url=f"{base_url}?page={current_page}"
            
            try:
                project_urls = scraper.get_category_project_urls(page, list_url, limit=30)
            except Exception as e:
                print(f"❌ 获取第 {current_page} 页列表失败: {e}")
                break
            
            if not project_urls:
                print(f"⚠️ 第 {current_page} 页没有找到任何项目，可能是最后一页了。")
                break

            for url in project_urls:
                if total_scraped >= TARGET_TOTAL:
                    break

                # 🛡️ 【终极拦截器：1 毫秒识别，不浪费任何资源！】
                if db.check_url_exists(url):
                    print(f"⏩ [去重跳过] 数据库中已存在: {url}")
                    continue # 直接跳过当前网址，进行下一个循环！

                print(f"\n🚀 [进度: {total_scraped + 1}/{TARGET_TOTAL}] 开始抓取: {url}")
                try:
                    # 第一步：提取 (Extract)
                    raw_data = scraper.scrape_project_data(page, url)
                    
                    # 只有成功抓到标题和内容的，才往下走
                    if raw_data and raw_data['title'] != "Unknown Title":
                        # 🏷️ 【核心】：把网址打上标签，送给下个部门存进数据库
                        raw_data['url'] = url
                        # 第二步：转换 (Transform)
                        raw_data['gallery'] = processor.process_images(raw_data['raw_gallery'])
                        raw_data['embedding'] = processor.generate_embedding(raw_data)
                        
                        # 第三步：加载 (Load)
                        db.insert_project(raw_data)
                        total_scraped += 1  # 计数器 +1
                            
                        # ⚠️ 爬虫礼仪：休息 3 秒
                        print("⏳ 休息 3 秒，防止被封 IP...")
                        time.sleep(3)
                    else:
                        print(f"⚠️ 跳过无效项目")
                except Exception as e:
                    print(f"流水线中断报错: {e}")
            current_page += 1
                
        browser.close()
        print("🎉 所有任务处理完成！")

if __name__ == "__main__":
    main()