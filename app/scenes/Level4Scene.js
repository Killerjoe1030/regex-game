export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super("Level4Scene");
    this.buttonSize = { x: 40, y: 20 };
    this.solution = "ABCD"; //Solution for Level 1
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
      Level 4 Problem SetLorem ipsum dolor sit amet, 
      consectetur adipiscing elit, sed do eiusmod tempor 
      incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
    const options = ["A", "B", "C", "D"]; //Change options based on unlocked regex components
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
