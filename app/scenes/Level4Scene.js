export default class Level1Scene extends Phaser.Scene {
  
  constructor() {
    super("Level4Scene");
    this.buttonSize = { x: 40, y: 20 };
    this.solution = "\\b(Tyran\\s+){2}Tyran\\b"; //Solution for Level 4 
    this.payloadText = 'The Tyrannosaurus rex was feeling dramatic. Tyran Tyran Tyran echoed through the valley as the rex practiced his villain laugh. Some called him a tyrant, others just called him Rex, but everyone agreed that when Tyran Tyran Tyran appeared in the jungle, snacks mysteriously disappeared.'

  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    //Title of Level
    this.add.text(
      centerX,
      centerY - 500,
      "Level 4 - Because I am the CARNIVORE",
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
      ${this.payloadText}\n\n
       Using regex, highlight all instances of "Tyran Tyran Tyran" where "Tyran" is repeated exactly three times with at least one space in between each occurrence. Make sure to include word boundaries to avoid partial matches.
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
    const options = [
      "\\b(Tyran){2}\\sTyran\\b", 
      "\\b(Tyran\\s+){2}", 
      "\\b(Tyran\\s+){3}", 
      "Tyran\\b"
    ]; //Change options based on unlocked regex components
    const totalSpan = 1400; // Total width for all buttons
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
      this.scene.start("FinalLevelScene");
    });
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
    btn.on("pointerdown", () => {
      
      this.outputText.setText(this.outputText.text + value);

      // Test if Regex selected by the user matches the solution
      if(this.outputText.text === this.solution) {
        window.GameState.score += 1; // Increment score
        this.time.delayedCall(500, () => {
        this.scene.start("TitleScene"); // Move to next level after a short delay
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
