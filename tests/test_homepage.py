def test_homepage_loads(browser):
    browser.get("http://localhost:3000") 
    print(browser.title) 
    assert "Mini Game Hub" in browser.title

def test_game_links_exist(browser):
    browser.get("http://localhost:3000")
    links = browser.find_elements("css selector", "#root > div > ul > li:nth-child(1) > a > strong")
    assert len(links) > 0
