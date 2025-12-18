export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super("Level1Scene");
    this.buttonSize = { x: 40, y: 20 };
    this.solution = "\bHerbivorous\b"; //Solution for Level 1
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    //Title of Level
    this.add.text(
      centerX,
      centerY - 500,
      "Level 1",
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 }
      }
    ).setOrigin(0.5);

    //Text area showing the payload of the level
    this.add.text(
      centerX,
      centerY - 300,
      `
       The Stegosaurus is a genus of herbivorous four-legged armored dinosaurs from
       the Late Jurassic period, characterized by the distinctive kite-shaped upright plates
       along their backs and spikes on their tails. Herbivorous, large, and heavily built with 
       rounded backs, short fore limbs, long hind limbs, and tails held high in the air. Due to
       their distinctive combination of broad, upright plates and tail tipped with spikes, Stegosaurus
       is one of the most recognizable kinds of dinosaurs. The function of this array of plates and spikes
       has been the subject of much speculation among scientists. Today, it is generally agreed their 
       spiked tails were most likely used as defense against predators, while their plates may have been 
       used primarily for display, and secondarily for thermoregulatory functions.
      `,
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 }
      }
    ).setOrigin(0.5);

    //Text area showing the constructed regex string
    this.outputText = this.add.text(
      centerX, 
      centerY, "", {
        fontSize: "28px",
        backgroundColor: "#000000",
        color: "#00ff00",
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    //Buttons for all regex components
    //Option buttons for each regex component -- don't forget to change method name and createOptionButton method
    const options = ["herbivorous", "/b", "\\b", "[A-Z]", "Herbivorous"]; //Change options based on unlocked regex components
    const totalSpan = 400; // Total width for all buttons
    const spacing = options.length > 1 ? totalSpan / (options.length - 1) : 0;
    options.forEach((value, index) => {
      const offset = index - (options.length - 1) / 2;
      this.createOptionButton(centerX + offset * spacing, centerY + 300, value);
    });

    //Reset button to clear constructed regex string -- don't forget to change method name and createResetButton method
    const bottomTotalSpan = 200; // Increased for padding between buttons
    const bottomSpacing = bottomTotalSpan / 1; // For 2 buttons
    this.createResetButton(centerX - bottomSpacing / 2, centerY + 500, "Reset");

    //Continue button to next level -- don't forget to change scene name and createContinueButton method
    this.createContinueButton(centerX + bottomSpacing / 2, centerY + 500, "Continue", () => {
      this.scene.start("Level2Scene");
    });
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
      if (char === "\n") { x = width * 0.05; y += lineHeight; return; }

      const txt = this.add.text(x, y, char, { fontFamily: "monospace", fontSize, color: "#ffffff" });
      if (x + txt.width > width * 0.05 + maxWidth) {
        x = width * 0.05;
        y += lineHeight;
        txt.setPosition(x, y);
      }

      x += txt.width;
      this.charObjects.push(txt);
    });

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
        this.charObjects[i]?.setColor("#00ff00");
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
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
    // btn.on("pointerdown", () => {
      
    //   this.outputText.setText(this.outputText.text + value);
    btn.on("pointerdown", () => {
      this.regexString += value;
      this.outputText.setText(this.regexString);
      this.updateHighlights();
    });

      if (this.outputText.text === this.solution) {
        // Correct solution entered
        window.GameState.score += 1; // Increment score
        this.time.delayedCall(500, () => {
          this.scene.start("Level2Scene"); // Move to next level after a short delay
        });
      }
    });
  }

  createResetButton(x, y, label) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
    btn.on("pointerdown", () => {
      this.outputText.setText("");
    });
  }

  createContinueButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
    btn.on("pointerdown", callback);
  }
}