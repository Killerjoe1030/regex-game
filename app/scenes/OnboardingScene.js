export default class OnboardingLevelScene extends Phaser.Scene {
  constructor() {
    super("OnboardingScene");
    this.buttonSize = { x: 50, y: 25 };
    this.expectedMatches = [
      "Dinosaur"
    ];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.regexString = "";

    this.add.text(width / 2, height * 0.1, "Level 1", {
      fontSize: `${Math.floor(height * 0.035)}px`,
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width * 0.9 }
    }).setOrigin(0.5);

    this.sourceText = 
      `
      Dinosaurs are a diverse group of reptiles that roamed the Earth over a hundred 
      million years ago. They first appeared during the triassic period. They are characterized 
      by an upright stance from a hole in their hip socket, allowing legs to be directly under the body.

      Use the Regex blocks to highlight the word: Dinosaur
      `;

    this.chars = [...this.sourceText];
    this.charObjects = [];
    this.renderChars(width, height);

    this.outputText = this.add.text(width / 2, height * 0.5, "", {
      fontSize: `${Math.floor(height * 0.04)}px`,
      backgroundColor: "#000000",
      color: "#00ff00",
      padding: { x: 20, y: 10 },
      align: "center",
      wordWrap: { width: width * 0.9 }
    }).setOrigin(0.5);

    this.scoreText = this.add.text(width / 2, height * 0.58, "Score: 0", {
      fontSize: `${Math.floor(height * 0.03)}px`,
      color: "#ffff00"
    }).setOrigin(0.5);

    // SAFE buttons (no literals)
    const components = [
        "Dino",
        "\\b",
        "/b",
        "saur"
    ];

    const buttonSpacing = 10;
    const buttonHeight = 50;
    const maxRowWidth = width * 0.9;
    let row = [];
    let rowWidth = 0;
    let y = height * 0.65;

    components.forEach((value) => {
      const temp = this.add.text(0, 0, value, { fontSize: "24px", padding: { x: this.buttonSize.x, y: this.buttonSize.y } });
      const btnWidth = temp.width + buttonSpacing;
      temp.destroy();

      if (rowWidth + btnWidth > maxRowWidth) {
        let startX = (width - rowWidth + buttonSpacing) / 2;
        row.forEach(b => this.createOptionButton(startX + b.offset, y, b.value));
        row = [];
        rowWidth = 0;
        y += buttonHeight;
      }

      row.push({ value, offset: rowWidth });
      rowWidth += btnWidth;
    });

    if (row.length > 0) {
      let startX = (width - rowWidth + buttonSpacing) / 2;
      row.forEach(b => this.createOptionButton(startX + b.offset, y, b.value));
    }

    this.createResetButton(width * 0.35, height * 0.85, "Reset");
    this.createSolveButton(width * 0.65, height * 0.85, "Solve");

    this.createOnboardingPrompt();
  }

  renderChars(width, height) {
    let x = width * 0.05;
    let y = height * 0.2;
    const fontSize = Math.floor(height * 0.03);
    const lineHeight = fontSize * 1.5;
    const maxWidth = width * 0.9;
    const q = 1;

    this.charObjects.forEach(c => c.destroy());
    this.charObjects = [];

    this.chars.forEach((char, index) => {
      if (char == '\n'){
        x = width * 0.05;
        y += lineHeight;
        return;
      }

      const txt = this.add.text(x,y,char, {
        fontFamily: "monospace",
        fontSize,
        color: "#ffffff"
      });

      txt.sourceIndex = index;
      this.charObjects.push(txt);

      x += txt.width;
    });

    // this.chars.forEach(char => {
    //   if (char === "\n") { x = width * 0.05; y += lineHeight; return; }

    //   const txt = this.add.text(x, y, char, { fontFamily: "monospace", fontSize, color: "#ffffff" });
    //   if (x + txt.width > width * 0.05 + maxWidth) {
    //     x = width * 0.05;
    //     y += lineHeight;
    //     txt.setPosition(x, y);
    //   }

    //   x += txt.width;
    //   this.charObjects.push(txt);
    // });

    const totalWidth = this.charObjects.reduce((acc, c) => Math.max(acc, c.x + c.width), 0) - width * 0.05;
    const offsetX = (width - totalWidth) / 2 - width * 0.05;
    this.charObjects.forEach(c => c.x += offsetX);
  }

  updateHighlights() {
    this.charObjects.forEach(c => c.setColor("#ffffff"));
    if (!this.regexString) return;

    let regex;
    try { regex = new RegExp(this.regexString, "g"); } catch { return; }

    let match;
    while ((match = regex.exec(this.sourceText)) !== null) {
      if (match[0].length === 0) { regex.lastIndex++; continue; } // prevent freeze
      for (let i = match.index; i < match.index + match[0].length; i++) {
        // this.charObjects[i]?.setColor("#00ff00");
        this.charObjects
          .filter(c => c.sourceIndex === i)
          .forEach(c => c.setColor("#00ff00"));
      }
    }
  }

  getMatchRanges(regex, text) {
    const ranges = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[0].length === 0) { regex.lastIndex++; continue; } // prevent freeze
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
    return ranges;
  }

  evaluateRegex(regexString) {
    let regex;
    try { regex = new RegExp(regexString, "g"); } catch { return { score: 0, reason: "Invalid regex" }; }

    const matches = this.getMatchRanges(regex, this.sourceText).map(m => this.sourceText.slice(m.start, m.end));
    const hits = this.expectedMatches.filter(payload => matches.includes(payload));

    const score = (hits.length / this.expectedMatches.length) * 100;
    let reason;
    if (score === 100) reason = "Perfect match";
    else if (score > 0) reason = `Partial match: ${hits.length}/${this.expectedMatches.length}`;
    else reason = "No expected matches";

    return { score, reason };
  }

  createOptionButton(x, y, value) {
    const btn = this.add.text(x, y, value, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
    btn.on("pointerdown", () => {
      this.regexString += value;
      this.outputText.setText(this.regexString);
      this.updateHighlights();
    });
  }

  createResetButton(x, y, label) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      this.regexString = "";
      this.outputText.setText("");
      this.updateHighlights();
      this.scoreText.setText("Score: 0");
    });
  }

  createSolveButton(x, y, label) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      const evaluation = this.evaluateRegex(this.regexString);
      this.scoreText.setText(`Score: ${evaluation.score}`);
      if (evaluation.score === 100) {
        window.GameState.score += 1;

        this.time.delayedCall(500, () => this.scene.start("Level1Scene"));
      }
    });
  }

  createOnboardingPrompt() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const padding = 40;
    const maxWidth = this.scale.width - 300;

    // Container to hold all onboarding UI
    const container = this.add.container(0, 0);

    // Dark overlay background
    const overlay = this.add.rectangle(
      centerX,
      centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6
    ).setInteractive();

    // Onboarding text
    const onboardingText = this.add.text(
      centerX,
      centerY,
      `Welcome to the tutorial!

  In this game, you build patterns by clicking the buttons below.

  Each button adds a new piece to your solution.

  Your goal is to construct a valid Regex statement that highlights the correct answer shown in the level.\n
  Click anywhere to begin!`,
      {
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 300 }
      }
    ).setOrigin(0.5);

    const bgWidth = maxWidth + padding * 2; 
    const bgHeight = onboardingText.height + padding * 2;

    // Modal background
    const modalBg = this.add.rectangle(
      centerX,
      centerY,
      bgWidth,
      bgHeight,
      0x111111,
      0.95
    ).setStrokeStyle(2, 0xffffff);

    // Add everything to container
    container.add([overlay, modalBg, onboardingText]);

    // Make container interactive and dismiss on click
    overlay.setInteractive();
    overlay.on("pointerdown", () => {
      container.destroy();
    });
  }

}