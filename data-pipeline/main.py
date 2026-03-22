from playwright.sync_api import sync_playwright
import db
import scraper
import processor
import time

def main():
    # 1. Initialize the database
    db.init_db()
    # 2. Set the scraping target
    TARGET_TOTAL = 30       # Total number of projects to scrape
    total_scraped = 0       # Counter: how many have been successfully scraped
    current_page = 1        # Pagination tracker: which listing page we're on

    # Base URL for all ArchDaily projects listing
    base_url = "https://www.archdaily.com/search/projects"
    
    # 3. Launch the automated pipeline
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True) 
        page = browser.new_page()
        
        while total_scraped < TARGET_TOTAL:
            print(f"\n====== Scanning listing page {current_page} =======")

            if current_page == 1:
                list_url = base_url
            else:
                list_url = f"{base_url}?page={current_page}"
            
            try:
                project_urls = scraper.get_category_project_urls(page, list_url, limit=30)
            except Exception as e:
                print(f"❌ Failed to fetch listing page {current_page}: {e}")
                break
            
            if not project_urls:
                print(f"⚠️ No projects found on page {current_page}. This may be the last page.")
                break

            for url in project_urls:
                if total_scraped >= TARGET_TOTAL:
                    break

                # Deduplication check — skip if already in the database
                if db.check_url_exists(url):
                    print(f"⏩ [Skip] Already in database: {url}")
                    continue

                print(f"\n🚀 [Progress: {total_scraped + 1}/{TARGET_TOTAL}] Scraping: {url}")
                try:
                    # Open a fresh browser context per article to avoid session-based paywalls
                    ctx = browser.new_context()
                    project_page = ctx.new_page()
                    # Step 1: Extract
                    raw_data = scraper.scrape_project_data(project_page, url)
                    ctx.close()
                    
                    # Only proceed if a valid title and content were found
                    if raw_data and raw_data['title'] != "Unknown Title":
                        # Save the source URL alongside the project data
                        raw_data['url'] = url
                        # Step 2: Transform
                        raw_data['gallery'] = processor.process_images(raw_data['raw_gallery'])
                        raw_data['embedding'] = processor.generate_embedding(raw_data)
                        
                        # Step 3: Load
                        db.insert_project(raw_data)
                        total_scraped += 1
                            
                        # Be polite to the server — wait 3 seconds between requests
                        print("⏳ Waiting 3 seconds before next request...")
                        time.sleep(3)
                    else:
                        print(f"⚠️ Skipping invalid project")
                except Exception as e:
                    print(f"Pipeline error: {e}")
            current_page += 1
                
        browser.close()
        print("🎉 All tasks completed!")

if __name__ == "__main__":
    main()