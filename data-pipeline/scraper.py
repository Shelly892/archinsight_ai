import re

def get_category_project_urls(page, list_url, limit=30):
    """
    负责在列表页扫描并提取项目网址 (防弹翻页升级版)
    """
    print(f"\n[Scraper] 🔍 正在扫描列表页: {list_url}")
    page.goto(list_url, timeout=60000)
    
    # ---------------------------------------------------------
    # 【调试专用：无脑死等大法】
    # 删掉 try...except，换成下面这两行：
    print("[Scraper] ⏳ 正在等待网站数据渲染，请观察弹出的浏览器窗口...")
    page.wait_for_timeout(8000) 
    # ---------------------------------------------------------
    
    # 【升级 2：更严格的正则表达式与黑名单过滤】
    # 向浏览器（Chrome）里空投了一个 JavaScript 小间谍
    urls = page.evaluate(r'''() => {
        return Array.from(document.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => {
                // 1. 必须是 archdaily 的内部链接
                if (!href.includes('archdaily.com/')) return false;
                
                // 2. 【黑名单】绝对不能是建筑师事务所、标签页或单纯的图片链接
                if (href.includes('/office/') || href.includes('/tag/') || href.includes('.jpg')) return false;
                
                // 3. 【核心特征】真正的项目网址必定包含斜杠夹着的 6 位以上纯数字
                // 例如: archdaily.com/1013898/house-name
                return /\/\d{6,}\//.test(href);
            });
    }''')
    
    # 严格去重与清洗（你已经完全掌握的劈砍法）
    unique_urls = []
    for url in urls:
        clean_url = url.split('#')[0].split('?')[0]
        if clean_url not in unique_urls:
            unique_urls.append(clean_url)
            
    found_urls = unique_urls[:limit]
    print(f"[Scraper] 🎯 在该页成功提取到 {len(found_urls)} 个纯净的项目网址")
    
    return found_urls


# playwright 
def scrape_project_data(page, url):
    """负责从网页提取原始文本和原图链接"""
    print(f"[Scraper] 正在抓取: {url}")
    page.goto(url, timeout=90000,wait_until="domcontentloaded") # timeout 60s
    
    title = page.locator('h1.afd-title-big').inner_text() if page.locator('h1.afd-title-big').count() > 0 else "Unknown Title"
    
    specs = {}
    for item in page.locator('.afd-specs__item').all():
        try:
            # 找到 afd-specs__key 和 afd-specs__value
            label = item.locator('.afd-specs__key').inner_text().strip().replace(':', '').replace('\xa0', '')
            value = item.locator('.afd-specs__value').inner_text().strip()
            specs[label] = value
        except:
            continue
    
    print(f"[Scraper] 成功提取到属性字典: {specs}")
    year_match = re.search(r'\d{4}', specs.get('Year', ''))
    year = int(year_match.group()) if year_match else None

    paragraphs = page.locator('article p').all_inner_texts()
    description = "\n".join([p for p in paragraphs if p.strip()])
    
    raw_gallery = []
    for img in page.locator('picture source').all():
        src = img.get_attribute('srcset') or img.get_attribute('src')
        if src and 'http' in src:
            clean_url = src.split(' ')[0]
            if clean_url not in raw_gallery:
                raw_gallery.append(clean_url)
                
    # 限制只拿前 5 张图，节省时间
    raw_gallery = raw_gallery[:5]

    return {
        "title": title,
        "architect": specs.get('Architects'),
        "year": year,
        "location": specs.get('Location'),
        "area": specs.get('Area'),
        "description": description,
        "raw_gallery": raw_gallery
    }