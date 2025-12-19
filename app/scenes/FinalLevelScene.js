export default class FinalLevelScene extends Phaser.Scene {
  constructor() {
    super("FinalLevelScene");
    this.buttonSize = { x: 20, y: 12 };

    this.expectedMatches = [
      "Researchers",
      "Denali National Park",
      "Coliseum",
      "Paleontologist Dustin Stewart",
      "2015"
    ];
  }

  create() {
    this.regexString = "";

    this.sourceText =
      `Researchers discovered a rocky outcrop at Denali National Park covered in thousands of dinosaur tracks, which they nicknamed the Coliseum. Paleontologist Dustin Stewart helped document the find during an expedition in the summer of 2015.`;

    this.chars = [...this.sourceText];
    this.charObjects = [];

    // === UI ELEMENTS ===
    this.titleText = this.add.text(0, 0, "Final Level - Regex Challenge", {
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.instructionsText = this.add.text(0, 0, "Use Regex to match the following strings: Researchers, Denali National Park, Coliseum, Paleontologist Dustin Stewart, 2015", {
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "22px",
      color: "#ffff00"
    }).setOrigin(0, 0);

    this.pauseButton = this.add.text(0, 20, "⏸ Pause", {
      fontSize: "20px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: 10, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    this.pauseButton.on("pointerdown", () => this.showPauseOverlay());

    this.outputText = this.add.text(0, 0, "", {
      fontSize: "24px",
      backgroundColor: "#000000",
      color: "#00ff00",
      padding: { x: 12, y: 8 },
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // === RENDER TEXT ===
    this.renderChars();

    // === REGEX BUTTONS ===
    this.components = [
      "\\w", "[A-Z]", "[a-z]", "\\d", "+", "\\s",
      "|", "@", "\\.", "[0-9]", "[^ ]", "(", ")"
    ];

    this.regexButtons = [];
    this.createRegexButtons();

    // === CONTROL BUTTONS ===
    this.resetButton = this.createActionButton("Reset", () => this.resetRegex());
    this.solveButton = this.createActionButton("Solve", () => this.solveRegex());

    // === PAUSE OVERLAY ===
    this.createPauseOverlay();

    // === RESPONSIVE LAYOUT ===
    this.scale.on("resize", () => this.layoutUI());
    this.layoutUI();
  }

  // ================= LAYOUT =================

  layoutUI() {
    const { width, height } = this.scale;

    this.titleText.setPosition(width / 2, 20);
    this.scoreText.setPosition(20, 20);
    this.pauseButton.setPosition(width - 20, 20);

    this.instructionsText.setPosition(width / 2, 100);

    this.outputText.setPosition(width / 2, height * 0.52);
    this.outputText.setWordWrapWidth(width * 0.85);

    this.layoutRegexButtons();

    this.resetButton.setPosition(width * 0.35, height - 40);
    this.solveButton.setPosition(width * 0.65, height - 40);

    this.layoutPauseOverlay();
  }

  // ================= REGEX BUTTON GRID =================

  createRegexButtons() {
    this.components.forEach(value => {
      const btn = this.add.text(0, 0, value, {
        fontSize: "20px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: this.buttonSize
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
      btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
      btn.on("pointerdown", () => {
        this.regexString += value;
        this.outputText.setText(this.regexString);
        this.updateHighlights();
      });

      this.regexButtons.push(btn);
    });
  }

  layoutRegexButtons() {
    const { width, height } = this.scale;

    const cols = Math.floor(width / 120);
    const startY = height * 0.65;
    const spacingX = 110;
    const spacingY = 50;

    this.regexButtons.forEach((btn, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      btn.setPosition(
        width / 2 - ((cols - 1) * spacingX) / 2 + col * spacingX,
        startY + row * spacingY
      );
    });
  }

  // ================= TEXT RENDER =================

  renderChars() {
    const { width, height } = this.scale;

    let x = width * 0.05;
    let y = height * 0.15;
    const fontSize = 20;
    const lineHeight = 30;
    const maxWidth = width * 0.9;

    this.charObjects.forEach(c => c.destroy());
    this.charObjects = [];

    this.chars.forEach(char => {
      const txt = this.add.text(x, y, char, {
        fontFamily: "monospace",
        fontSize,
        color: "#ffffff"
      });

      if (x + txt.width > width * 0.05 + maxWidth) {
        x = width * 0.05;
        y += lineHeight;
        txt.setPosition(x, y);
      }

      x += txt.width;
      this.charObjects.push(txt);
    });
  }

  // ================= HIGHLIGHT LOGIC =================

  updateHighlights() {
    this.charObjects.forEach(c => c.setColor("#ffffff"));
    if (!this.regexString) return;

    let regex;
    try { regex = new RegExp(this.regexString, "g"); }
    catch { return; }

    const expected = new Set(this.expectedMatches);
    const matches = [];

    let m;
    while ((m = regex.exec(this.sourceText)) !== null) {
      if (!m[0]) { regex.lastIndex++; continue; }
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
    }

    matches.filter(m => expected.has(m.text)).forEach(m => {
      for (let i = m.start; i < m.end; i++) {
        this.charObjects[i]?.setColor("#00ff00");
      }
    });

    matches.filter(m => !expected.has(m.text)).forEach(m => {
      for (let i = m.start; i < m.end; i++) {
        if (this.charObjects[i]?.style.color === "#ffffff") {
          this.charObjects[i]?.setColor("#ff5555");
        }
      }
    });
  }

  // ================= ACTION BUTTONS =================

  createActionButton(label, onClick) {
    const btn = this.add.text(0, 0, label, {
      fontSize: "22px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", onClick);
    return btn;
  }

  resetRegex() {
    this.regexString = "";
    this.outputText.setText("");
    this.updateHighlights();
    this.scoreText.setText("Score: 0");
  }

  solveRegex() {
    const score = this.evaluateRegex(this.regexString);
    this.scoreText.setText(`Score: ${score.score}`);
  }

  // ================= PAUSE OVERLAY =================

  createPauseOverlay() {
    this.pauseOverlay = this.add.container(0, 0).setVisible(false);

    const bg = this.add.rectangle(0, 0, 100, 100, 0x000000, 0.7).setOrigin(0);
    const text = this.add.text(0, 0, "Game Paused", {
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Resume button
    const resume = this.createActionButton("Resume", () => this.hidePauseOverlay());

    // Quit button
    const quit = this.createActionButton("Quit", () => this.scene.start("TitleScene"));

    this.pauseOverlay.add([bg, text, resume, quit]);
    this.pauseElements = { bg, text, resume, quit };
  }

  layoutPauseOverlay() {
    const { width, height } = this.scale;

    this.pauseElements.bg.setSize(width, height);
    this.pauseElements.text.setPosition(width / 2, height / 2 - 40);
    this.pauseElements.resume.setPosition(width / 2, height / 2 + 20);
    this.pauseElements.quit.setPosition(width / 2, height / 2 + 70);
  }

  showPauseOverlay() {
    this.pauseOverlay.setVisible(true);

    // Disable game buttons
    this.regexButtons.forEach(b => b.disableInteractive());
    this.resetButton.disableInteractive();
    this.solveButton.disableInteractive();
  }

  hidePauseOverlay() {
    this.pauseOverlay.setVisible(false);

    // Re-enable game buttons
    this.regexButtons.forEach(b => b.setInteractive({ useHandCursor: true }));
    this.resetButton.setInteractive({ useHandCursor: true });
    this.solveButton.setInteractive({ useHandCursor: true });
  }
}