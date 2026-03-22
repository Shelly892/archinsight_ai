import re

def get_category_project_urls(page, list_url, limit=30):
    """
    Scans a listing page and extracts project URLs.
    """
    print(f"\n[Scraper] 🔍 Scanning listing page: {list_url}")
    page.goto(list_url, timeout=60000)
    
    # ---------------------------------------------------------
    # Wait for the page to fully render before extracting URLs
    print("[Scraper] ⏳ Waiting for page to render...")
    page.wait_for_timeout(8000) 
    # ---------------------------------------------------------
    
    # Inject a JS snippet into the browser to collect all valid project hrefs
    urls = page.evaluate(r'''() => {
        return Array.from(document.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => {
                // 1. Must be an internal archdaily.com link
                if (!href.includes('archdaily.com/')) return false;
                
                // 2. Blocklist: exclude office pages, tag pages, and raw image links
                if (href.includes('/office/') || href.includes('/tag/') || href.includes('.jpg')) return false;
                
                // 3. Core pattern: real project URLs always contain 6+ digits between slashes
                // e.g. archdaily.com/1013898/house-name
                return /\/\d{6,}\//.test(href);
            });
    }''')
    
    # Deduplicate and clean URLs
    unique_urls = []
    for url in urls:
        clean_url = url.split('#')[0].split('?')[0]
        if clean_url not in unique_urls:
            unique_urls.append(clean_url)
            
    found_urls = unique_urls[:limit]
    print(f"[Scraper] 🎯 Extracted {len(found_urls)} clean project URLs from this page")
    
    return found_urls


# playwright 
def scrape_project_data(page, url):
    """Extracts raw text and image links from a project page."""
    print(f"[Scraper] Scraping: {url}")
    page.goto(url, timeout=90000, wait_until="domcontentloaded")
    
    title = page.locator('h1.afd-title-big').inner_text() if page.locator('h1.afd-title-big').count() > 0 else "Unknown Title"
    
    specs = {}
    for item in page.locator('.afd-specs__item').all():
        try:
            # Extract key/value pairs from the specs section
            label = item.locator('.afd-specs__key').inner_text().strip().replace(':', '').replace('\xa0', '')
            value = item.locator('.afd-specs__value').inner_text().strip()
            specs[label] = value
        except:
            continue
    
    print(f"[Scraper] Successfully extracted specs: {specs}")
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
                
    # Limit to first 5 images to save time
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