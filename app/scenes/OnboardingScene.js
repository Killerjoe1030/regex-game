export default class OnboardingScene extends Phaser.Scene {
  constructor() {
    super("OnboardingScene");
    this.buttonSize = { x: 40, y: 20 };
    this.solution = "Dinosaurs"; //Solution for Level 1
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    //Title of Level
    this.add.text(
      centerX,
      centerY - 500,
      "Onboarding Level",
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
      Dinosaurs are a diverse group of reptiles that roamed the Earth over a hundred 
      million years ago. They first appeared during the triassic period. They are characterized 
      by an upright stance from a hole in their hip socket, allowing legs to be directly under the body.
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
      this.scene.start("Level1Scene");
    });

    this.createOnboardingPrompt();
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
          this.scene.start("Level1Scene"); // Move to next level after a short delay
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