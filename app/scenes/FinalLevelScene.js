export default class FinalLevelScene extends Phaser.Scene {
  constructor() {
    super("FinalLevelScene");
    this.buttonSize = { x: 50, y: 25 };
    this.expectedMatches = [
      "Researchers",
      "Denali National Park",
      "Coliseum",
      "Paleontologist Dustin Stewart",
      "2015"
    ];
  }
  
  //[A-Z][a-z]+\s[A-Z][a-z]+\s[A-Z][a-z]+|[A-Z][a-z]+|[A-Z][a-z]+\s[A-Z][a-z]+|\d\d\d\d

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.regexString = "";

    this.add.text(width / 2, height * 0.1, "Final Level - Regex Challenge", {
      fontSize: `${Math.floor(height * 0.035)}px`,
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width * 0.9 }
    }).setOrigin(0.5);

    this.sourceText =
      `Researchers discovered a rocky outcrop at Denali National Park covered in thousands of dinosaur tracks, which they nicknamed the Coliseum. Paleontologist Dustin Stewart helped document the find during an expedition in the summer of 2015.`;

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

    const components = [
      "\\w",
      "[A-Z]",
      "[a-z]",
      "\\d",
      "+",
      "\\s",
      "|",
      "@",
      "\\.",
      "[0-9]",
      "[^ ]",
      "(",
      ")"
    ];

    const buttonSpacing = 10;
    const buttonHeight = 50;
    const maxRowWidth = width * 0.9;
    let row = [];
    let rowWidth = 0;
    let y = height * 0.65;

    components.forEach((value) => {
      const temp = this.add.text(0, 0, value, {
        fontSize: "24px",
        padding: { x: this.buttonSize.x, y: this.buttonSize.y }
      });
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
  }

  renderChars(width, height) {
    let x = width * 0.05;
    let y = height * 0.2;
    const fontSize = Math.floor(height * 0.03);
    const lineHeight = fontSize * 1.5;
    const maxWidth = width * 0.9;

    this.charObjects.forEach(c => c.destroy());
    this.charObjects = [];

    this.chars.forEach(char => {
      if (char === "\n") {
        x = width * 0.05;
        y += lineHeight;
        return;
      }

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

    const totalWidth =
      this.charObjects.reduce((acc, c) => Math.max(acc, c.x + c.width), 0)
      - width * 0.05;

    const offsetX = (width - totalWidth) / 2 - width * 0.05;
    this.charObjects.forEach(c => c.x += offsetX);
  }

  updateHighlights() {
    // 1. Reset all
    this.charObjects.forEach(c => c.setColor("#ffffff"));
    if (!this.regexString) return;

    let regex;
    try {
      regex = new RegExp(this.regexString, "g");
    } catch {
      return;
    }

    const expectedSet = new Set(this.expectedMatches);

    // 2. Collect matches
    const matches = [];
    let match;
    while ((match = regex.exec(this.sourceText)) !== null) {
      if (match[0].length === 0) {
        regex.lastIndex++;
        continue;
      }
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }

    // 3. Paint GREEN first (highest priority)
    matches
      .filter(m => expectedSet.has(m.text))
      .forEach(m => {
        for (let i = m.start; i < m.end; i++) {
          this.charObjects[i]?.setColor("#00ff00");
        }
      });

    // 4. Paint RED only if still white
    matches
      .filter(m => !expectedSet.has(m.text))
      .forEach(m => {
        for (let i = m.start; i < m.end; i++) {
          if (this.charObjects[i]?.style.color === "#ffffff") {
            this.charObjects[i]?.setColor("#ff5555");
          }
        }
      });
  }

  getMatchRanges(regex, text) {
    const ranges = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match[0].length === 0) {
        regex.lastIndex++;
        continue;
      }

      ranges.push({
        start: match.index,
        end: Math.min(match.index + match[0].length, this.charObjects.length)
      });
    }

    return ranges;
  }

  evaluateRegex(regexString) {
    let regex;
    try {
      regex = new RegExp(regexString, "g");
    } catch {
      return { score: 0, reason: "Invalid regex" };
    }

    const ranges = this.getMatchRanges(regex, this.sourceText);
    const matches = ranges.map(r =>
      this.sourceText.slice(r.start, r.end)
    );

    const uniqueMatches = [...new Set(matches)];
    const expectedHits = this.expectedMatches.filter(e =>
      uniqueMatches.includes(e)
    );

    const falsePositives = uniqueMatches.filter(m =>
      !this.expectedMatches.includes(m)
    );

    const accuracy = expectedHits.length / this.expectedMatches.length;
    const precision =
      uniqueMatches.length === 0
        ? 0
        : expectedHits.length / uniqueMatches.length;

    const score = Math.round(accuracy * precision * 100);

    let reason = `Accuracy: ${expectedHits.length}/${this.expectedMatches.length}`;
    if (falsePositives.length) {
      reason += ` | False positives: ${falsePositives.length}`;
    }

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
      this.outputText.setColor("#00ff00");
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
      this.scoreText.setText(
        `Score: ${evaluation.score}\n${evaluation.reason}`
      );

      if (evaluation.score === 100) {
        window.GameState.score += 1;
        this.time.delayedCall(500, () => this.scene.start("TitleScene"));
      }
    });
  }
}