def test_homepage_loads(browser):
    browser.get("http://localhost:3000") 
    print(browser.title) 
    assert "Mini Game Hub" in browser.title

def test_game_links_exist(browser):
    browser.get("http://localhost:3000")
    links = browser.find_elements("css selector", ".game-link")
    assert len(links) > 0

def test_homepage_gamelinks_work(browser):
    browser.get("http://localhost:3000")

    # Find all game links
    links = browser.find_elements("css selector", ".game-link")
    assert len(links) >= 2  # Ensure all 3 expected links are there

    # Dictionary of link texts and expected URLs
    expected_links = {
        "Skiing Game": "/game/skiinggame",
        "Jumping Game": "/game/jumpinggame"
    }

    for link in links:
        text = link.text.strip()
        if text in expected_links:
            href = link.get_attribute("href")
            assert href.endswith(expected_links[text]), f"Expected {expected_links[text]} in {href}"
            
            # Click and verify page loaded (basic smoke check)
            link.click()
            assert browser.current_url.endswith(expected_links[text])

            # Go back to homepage before next click
            browser.back()