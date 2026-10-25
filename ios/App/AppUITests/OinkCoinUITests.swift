import XCTest

/// End to end tests for OinkCoin. They drive the real app in the simulator and attach a screenshot at
/// every step, so the Xcode report reads like a walkthrough. Test IDs (UI-xxx) match TestPlan.md.
///
/// The app runs in local mode (no Supabase keys), so signing up creates a device only account. State
/// survives between runs, so every test first calls `ensureHome()` to get to the same place.
final class OinkCoinUITests: XCTestCase {
    private let app = XCUIApplication()
    private let email = "tester@oinkcoin.test"
    private let password = "Oink-test-123"
    private let buddy = "Oink"  // used only when onboarding creates a new buddy

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    // MARK: - Tests

    func testUI001_SignUpAndOnboarding() throws {
        try ensureHome()
        XCTAssertTrue(replyButton.waitForExistence(timeout: 10), "Home should show the buddy's Reply button")
        snap("Home screen after sign up and onboarding")
    }

    func testUI002_HomeShowsBuddyBubbleAndSpending() throws {
        try ensureHome()
        step("Buddy, speech bubble and totals are visible") {
            XCTAssertTrue(replyButton.exists, "Speech bubble Reply button")
            XCTAssertTrue(text("Spending").waitForExistence(timeout: 5), "Total spending label")
            XCTAssertTrue(text("Needs").exists && text("Wants").exists, "Needs and Wants cards")
            snap("Home")
        }
    }

    func testUI003_AddExpenseUpdatesReport() throws {
        try ensureHome()
        try addExpense(amount: "7.25", note: "Blue Bottle Coffee")
        step("The new expense is listed") {
            XCTAssertTrue(text("Blue Bottle Coffee").waitForExistence(timeout: 5), "Expense should appear in Transactions")
            snap("Report with new expense")
        }
    }

    func testUI004_ReplyButtonOpensChat() throws {
        try ensureHome()
        step("Tap Reply on the bubble") {
            tap(replyButton)
            XCTAssertTrue(chatField.waitForExistence(timeout: 5), "Chat input should be on screen")
            snap("Chat opened from the bubble")
        }
    }

    func testUI005_ChatAnswersQuestions() throws {
        try ensureHome()
        try openMenu("Chat with Oink")
        step("Ask about the balance") {
            send("What is my balance?")
            XCTAssertTrue(text("balance").waitForExistence(timeout: 5), "Oink should answer")
            snap("Chat answer about balance")
        }
        step("Tap a suggestion chip") {
            tap(button("How much is left?"))
            XCTAssertTrue(text("budget").waitForExistence(timeout: 5), "Chip should get an answer about the budget")
            snap("Chat answer from a chip")
        }
        step("Ask for a roast") {
            send("roast me")
            XCTAssertEqual(overflowing(page: "Chat with messages"), [], "Nothing should stick out once the chat has messages")
            snap("Chat roast")
        }
    }

    func testUI006_ForecastWhatIf() throws {
        try ensureHome()
        try addExpense(amount: "12.50", note: "Starbucks latte")
        try openMenu("Forecast")
        step("Forecast page loads") {
            XCTAssertTrue(text("What if I spent less?").waitForExistence(timeout: 5))
            snap("Forecast top")
        }
        step("Hardcore preset shows what you would keep") {
            tap(button("Hardcore"))
            XCTAssertTrue(text("Your plan saves").waitForExistence(timeout: 5), "Plan total should appear")
            let slider = app.sliders.matching(NSPredicate(format: "label CONTAINS[cd] 'Coffee'")).firstMatch
            XCTAssertTrue(slider.waitForExistence(timeout: 5))
            XCTAssertEqual(Double(slider.value as? String ?? ""), 50, "Hardcore should set the coffee slider to 50%")
            XCTAssertEqual(overflowing(page: "Forecast with a plan"), [], "Nothing should stick out once a plan is showing")
            snap("Forecast with hardcore plan")
        }
        step("Reset clears the plan") {
            tap(button("Reset"))
            XCTAssertTrue(text("Slide a cut").waitForExistence(timeout: 5), "Empty plan hint")
            let slider = app.sliders.matching(NSPredicate(format: "label CONTAINS[cd] 'Coffee'")).firstMatch
            XCTAssertEqual(Double(slider.value as? String ?? ""), 0, "Reset should put the coffee slider back to 0%")
            snap("Forecast reset")
        }
    }

    func testUI007_EveryMenuPageOpens() throws {
        try ensureHome()
        // Each menu item and a piece of text that only that page has, so a wrong destination fails.
        let pages: [(menu: String, marker: String)] = [
            ("Chat with Oink", "Ask"),
            ("Forecast", "What if I spent less?"),
            ("Pet History", "history"),
            ("Friends & House", "house"),
            ("Full Report", "Add expense"),
            ("Store", "Your coins"),
            ("Grow Your Money", "Saving methods"),
            ("Profile & Settings", "Account"),
            ("Budget Buddy", "Reply to"),
        ]
        for page in pages {
            try openMenu(page.menu)
            let marker = app.webViews.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[cd] %@ OR placeholderValue CONTAINS[cd] %@", page.marker, page.marker)).firstMatch
            XCTAssertTrue(marker.waitForExistence(timeout: 8), "\(page.menu) should open its own page (looked for \"\(page.marker)\")")
            snap("Page: \(page.menu)")
        }
    }

    func testUI009_NothingExtendsPastTheScreenEdge() throws {
        try ensureHome()
        var offenders: [String] = []
        for item in ["Budget Buddy", "Chat with Oink", "Forecast", "Full Report", "Store", "Grow Your Money", "Pet History"] {
            try openMenu(item)
            sleep(1)
            offenders += overflowing(page: item)
            snap("Fit check: \(item)")
        }
        XCTAssertTrue(offenders.isEmpty, "Elements past the screen edge:\n" + offenders.prefix(20).joined(separator: "\n"))
    }

    func testUI010_SpanishEverywhere() throws {
        try ensureHome()
        defer { try? switchLanguage(to: "English") }

        // Control: the English-word scanner must actually find English on an English page, or its silence below means nothing.
        try openMenu("Forecast")
        XCTAssertTrue(text("What if I spent less?").waitForExistence(timeout: 8))
        XCTAssertFalse(englishLeftovers(page: "control").isEmpty, "The English scanner should find English text on an English page")

        try switchLanguage(to: "Español")
        XCTAssertTrue(app.buttons["Abrir menú"].waitForExistence(timeout: 5), "The menu button should now be in Spanish")
        snap("Spanish: menu with language switch")

        // Each menu item (in Spanish) with a piece of text only that page has, also in Spanish.
        let pages: [(menu: String, marker: String)] = [
            ("Chatea con Oink", "Pregúntale a"),
            ("Pronóstico", "¿Y si gastara menos?"),
            ("Historial del compañero", "Historial de"),
            ("Amigos y casa", "casa"),
            ("Reporte completo", "Agregar gasto"),
            ("Tienda", "Tus monedas"),
            ("Haz crecer tu dinero", "Métodos de ahorro"),
            ("Perfil y ajustes", "Cuenta"),
            ("Tu compañero", "Responder a"),
        ]
        var offenders: [String] = []
        var english: [String] = []
        for page in pages {
            try openMenu(page.menu)
            let marker = app.webViews.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[cd] %@ OR placeholderValue CONTAINS[cd] %@", page.marker, page.marker)).firstMatch
            XCTAssertTrue(marker.waitForExistence(timeout: 8), "\(page.menu) should open in Spanish (looked for \"\(page.marker)\")")
            offenders += overflowing(page: "ES \(page.menu)")
            english += englishLeftovers(page: page.menu)
            snap("Spanish: \(page.menu)")
        }
        XCTAssertEqual(offenders, [], "Spanish text must not stick out past the screen edge")
        XCTAssertEqual(english, [], "Text still in English on the Spanish pages")

        // The chat understands Spanish.
        try openMenu("Chatea con Oink")
        step("Pregunta en español") {
            send("¿Cuánto me queda?")
            // Under budget: "Te quedan…"; over: "Te pasaste…"; used up: "Ya usaste…". Which one depends on the account.
            let answer = app.webViews.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[cd] 'Te quedan' OR label CONTAINS[cd] 'Te pasaste' OR label CONTAINS[cd] 'Ya usaste'")).firstMatch
            XCTAssertTrue(answer.waitForExistence(timeout: 5), "Oink should answer in Spanish")
            tap(button("¿Cuál es mi saldo?"))
            XCTAssertTrue(text("No hay un banco vinculado").waitForExistence(timeout: 5), "Balance answer in Spanish")
            XCTAssertEqual(overflowing(page: "ES chat with messages"), [])
            snap("Spanish: chat answers")
        }

        // The choice is remembered after the app restarts.
        app.terminate()
        app.launch()
        XCTAssertTrue(app.buttons["Abrir menú"].waitForExistence(timeout: 15), "Spanish should still be selected after relaunch")
        snap("Spanish: after relaunch")
    }

    func testUI008_AppStaysAliveAfterBackground() throws {
        try ensureHome()
        XCUIDevice.shared.press(.home)
        sleep(1)
        // The whole screen (not just the app) shows the icon on the iOS home screen.
        let homeScreen = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        homeScreen.name = "iOS home screen with the OinkCoin icon"
        homeScreen.lifetime = .keepAlways
        add(homeScreen)
        app.activate()
        XCTAssertTrue(replyButton.waitForExistence(timeout: 10), "App should come back to the home screen")
        snap("After returning from background")
    }

    // MARK: - Getting to the home screen

    /// The buddy's name is whatever the account chose, so match on the label prefix.
    private var replyButton: XCUIElement { app.buttons.matching(NSPredicate(format: "label BEGINSWITH 'Reply to' OR label BEGINSWITH 'Responder a'")).firstMatch }
    /// "Open menu" in English, "Abrir menú" in Spanish.
    private var menuButton: XCUIElement { app.buttons.matching(NSPredicate(format: "label == 'Open menu' OR label == 'Abrir menú'")).firstMatch }
    private var chatField: XCUIElement {
        app.textFields.matching(NSPredicate(format: "placeholderValue CONTAINS[cd] 'Ask' OR label CONTAINS[cd] 'Message' OR placeholderValue CONTAINS[cd] 'Pregúntale' OR label CONTAINS[cd] 'Mensaje para'")).firstMatch
    }

    /// Signs up, agrees to permissions, builds the buddy and skips the tour, whichever of those is still needed.
    private func ensureHome() throws {
        let deadline = Date().addingTimeInterval(90)
        while Date() < deadline {
            // The first-open tour sits on top of the home screen, so deal with it before calling it home.
            if button("Skip tour").exists || button("Close tour").exists {
                step("Skip the tour") {
                    snap("Quick tour")
                    tap(button("Skip tour").exists ? button("Skip tour") : button("Close tour"))
                }
                Thread.sleep(forTimeInterval: 1)
                continue
            }
            if replyButton.exists || menuButton.exists {
                try ensureEnglish()
                return
            }
            if text("Create your account").exists {
                step("Sign up") {
                    fill(textField: app.textFields.firstMatch, with: email)
                    fill(secure: 0, with: password)
                    fill(secure: 1, with: password)
                    snap("Sign up form")
                    tap(button("Sign up"))
                }
            } else if text("Welcome back").exists {
                step("Log in") {
                    if app.textFields.firstMatch.value as? String != email { fill(textField: app.textFields.firstMatch, with: email) }
                    fill(secure: 0, with: password)
                    tap(app.buttons["Log in"].firstMatch)
                }
            } else if text("Connect your bank").exists {
                step("Agree to permissions") {
                    snap("Permissions")
                    tap(app.switches.matching(NSPredicate(format: "label CONTAINS[cd] 'I agree'")).firstMatch.exists
                        ? app.switches.matching(NSPredicate(format: "label CONTAINS[cd] 'I agree'")).firstMatch
                        : text("I agree to let OinkCoin"))
                    tap(button("Agree"))
                }
            } else if text("Choose your buddy").exists {
                step("Name the buddy") {
                    fill(textField: app.textFields.matching(NSPredicate(format: "placeholderValue CONTAINS 'Penny'")).firstMatch, with: buddy)
                    snap("Choose your buddy")
                    tap(button("Next"))
                }
            } else if text("see your spending").exists {
                step("Skip bank import") {
                    snap("Spending source")
                    tap(button("Skip, I use cash"))
                }
            } else if text("monthly budget").exists {
                step("Pick a $3,000 budget") {
                    tap(app.webViews.descendants(matching: .any).matching(NSPredicate(format: "label == %@", "$3,000")).firstMatch)
                    snap("Budget")
                    tap(button("Next"))
                }
            } else if text("Set your goals").exists {
                step("Finish setup") {
                    snap("Goals")
                    tap(button("Let's go"))
                }
            }
            Thread.sleep(forTimeInterval: 1)
        }
        XCTFail("Could not reach the home screen within 90 seconds")
        throw XCTSkip("Home screen not reached")
    }

    // MARK: - Actions

    /// A previous run may have left the app in Spanish; every other test expects English.
    private func ensureEnglish() throws {
        guard app.buttons["Abrir menú"].exists else { return }
        try switchLanguage(to: "English")
    }

    private func switchLanguage(to language: String) throws {
        let menu = menuButton
        var swipes = 0
        while !menu.isHittable && swipes < 8 {
            app.swipeDown(velocity: .fast)
            swipes += 1
        }
        // The language buttons carry aria-pressed, so iOS reports them as toggles, not plain buttons.
        let choice = app.webViews.descendants(matching: .any).matching(NSPredicate(format: "label == %@", language)).firstMatch
        if !choice.isHittable { tap(menu) }
        tap(choice)
        sleep(1)
    }

    private func openMenu(_ item: String) throws {
        // Exact label, so it cannot grab the "0 coins, open store" button in the top bar, which sits under the menu overlay.
        let entry = app.buttons.matching(NSPredicate(format: "label == %@", item)).firstMatch
        // After switching language the menu is already open, so only open it if the item is not showing.
        if !entry.isHittable {
            let menu = menuButton
            // The top bar scrolls away with the page, so a person would scroll back up first.
            var swipes = 0
            while !menu.isHittable && swipes < 8 {
                app.swipeDown(velocity: .fast)
                swipes += 1
            }
            tap(menu)
        }
        XCTAssertTrue(entry.waitForExistence(timeout: 5), "Menu item \(item) should exist")
        entry.tap()
    }

    private func addExpense(amount: String, note: String) throws {
        try openMenu("Full Report")
        step("Add expense \(note)") {
            // The page has two Amount fields (Money in, then Add expense); the expense form is the last one.
            let amountField = app.textFields.matching(NSPredicate(format: "label CONTAINS[cd] 'Amount'")).allElementsBoundByIndex.last ?? app.textFields.firstMatch
            XCTAssertTrue(amountField.waitForExistence(timeout: 5), "Amount field")
            fill(textField: amountField, with: amount)
            fill(textField: app.textFields.matching(NSPredicate(format: "label CONTAINS[cd] 'Note' OR placeholderValue CONTAINS[cd] 'Note'")).firstMatch, with: note)
            tap(app.buttons.matching(NSPredicate(format: "label == 'Add'")).firstMatch)
        }
    }

    private func send(_ message: String) {
        fill(textField: chatField, with: message)
        let sendButton = app.webViews.buttons.matching(NSPredicate(format: "label CONTAINS[cd] 'Send' OR label CONTAINS[cd] 'Enviar'")).firstMatch
        if sendButton.waitForExistence(timeout: 5) { tap(sendButton) } else { chatField.typeText("\n") }  // the Return key also sends
    }

    /// Text on the page that still reads as English, found by common English words that Spanish never uses.
    /// Used on the Spanish pages, where any hit means a string was missed.
    private func englishLeftovers(page: String) -> [String] {
        let english = try! NSRegularExpression(pattern: "\\b(the|your|you|with|and|for|are|is|this|that|was|have|has|will|can|not|from|week|month)\\b", options: [.caseInsensitive])
        var found: [String] = []
        func walk(_ node: XCUIElementSnapshot) {
            let label = node.label
            // Skip the user's own data: transaction lines ("- THE GRILL ON UNION") and all caps merchant names.
            let isData = label.hasPrefix("- ") || (label == label.uppercased() && label.contains { $0.isLetter })
            if label.count > 12, !isData, english.firstMatch(in: label, range: NSRange(label.startIndex..., in: label)) != nil {
                found.append("\(page): '\(label.prefix(70))'")
            }
            node.children.forEach(walk)
        }
        if let snapshot = try? app.webViews.firstMatch.snapshot() { walk(snapshot) }
        return found
    }

    /// Everything in the page whose right edge is past the screen, found by walking a snapshot of the whole page.
    private func overflowing(page: String) -> [String] {
        let screen = app.windows.firstMatch.frame
        var found: [String] = []
        func walk(_ node: XCUIElementSnapshot) {
            let f = node.frame
            // The suggestion chips scroll sideways on purpose, and the fixed Feed/Play/Pet/Shop bar's tap area is wider than what you see.
            let ignored = node.label.hasSuffix(", navigation") && (node.label.hasPrefix("Care for your buddy") || node.label.hasPrefix("Cuida a tu compañero"))
                || ["What is my balance", "How much is left?", "Will I stay", "What if I cut", "Where am I over", "Give me a saving",
                    "¿Cuál es mi saldo", "¿Cuánto me queda", "¿Me voy a mantener", "¿Y si recorto", "¿En qué estoy gastando", "Dame un consejo"].contains { node.label.hasPrefix($0) }
            if f.width > 0 && !ignored && f.maxX > screen.width + 1 {
                found.append("\(page): type \(node.elementType.rawValue) '\(node.label.prefix(40))' [\(node.label.unicodeScalars.prefix(4).map { String($0.value, radix: 16) }.joined(separator: " "))] maxX=\(Int(f.maxX)) screen=\(Int(screen.width))")
            }
            node.children.forEach(walk)
        }
        if let snapshot = try? app.webViews.firstMatch.snapshot() { walk(snapshot) }
        return found
    }

    // MARK: - Helpers

    private func text(_ part: String) -> XCUIElement {
        app.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[cd] %@", part)).firstMatch
    }

    /// Looks only inside the app's web content, so it never hits iOS's own keyboard toolbar (which also has a "Next").
    private func button(_ part: String) -> XCUIElement {
        app.webViews.buttons.matching(NSPredicate(format: "label CONTAINS[cd] %@", part)).firstMatch
    }

    private func tap(_ element: XCUIElement, file: StaticString = #filePath, line: UInt = #line) {
        XCTAssertTrue(element.waitForExistence(timeout: 10), "Element to tap not found: \(element)", file: file, line: line)
        // Like a person would, scroll down until the element is on screen.
        var swipes = 0
        while !element.isHittable && swipes < 8 {
            app.swipeUp(velocity: .slow)
            swipes += 1
        }
        if element.isHittable { element.tap() } else { element.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap() }
    }

    /// A new device shows iOS's one time "slide to type" tip the first time the keyboard opens.
    private func dismissKeyboardTip() {
        let tip = app.buttons["Continue"]
        if tip.waitForExistence(timeout: 2) { tip.tap() }
    }

    private func fill(textField: XCUIElement, with value: String) {
        tap(textField)
        _ = app.keyboards.firstMatch.waitForExistence(timeout: 5)
        dismissKeyboardTip()
        if let current = textField.value as? String, !current.isEmpty, current != textField.placeholderValue {
            textField.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: current.count))
        }
        textField.typeText(value)
    }

    private func fill(secure index: Int, with value: String) {
        let field = app.secureTextFields.element(boundBy: index)
        tap(field)
        _ = app.keyboards.firstMatch.waitForExistence(timeout: 5)
        dismissKeyboardTip()
        field.typeText(value)
    }

    private func step(_ name: String, _ body: () -> Void) {
        XCTContext.runActivity(named: name) { _ in body() }
    }

    private func snap(_ name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
