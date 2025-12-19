export default class Level3Scene extends Phaser.Scene {
  constructor() {
    super("Level3Scene");
  }

getChallenge(){
  return "Spinosaurus was one of the largest carnivorous dinosaurs ever discovered and it has been extensively studied by many scientists. \"It had a long, narrow skull similar to modern crocodiles\" once said Dr. Paul Sereno. \"Evidence suggests spinosaurus was semi-aquatic\" noted Dr. Nizar Ibrahim. Its distinctive sail-like structure may have been used for display or thermoregulation. Fossils indicate it could reach lengths of over 50 feet. Dr. Thomas Holtz once remarked \"Spinosaurus challenges our understanding of predatory dinosaurs\".";
 }  

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    
    this.instructionsText = this.add.text(0, 0, "Use Regex to match all sentences with the word 'Spinosaurus' inside double quotes (\"),", {
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5);
    this.instructionsText.setPosition(this.scale.width / 2, 500);

    this.add.text(
      centerX,
      centerY - 500,
      "Level 3 Problem Set",
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 }
      }
    ).setOrigin(0.5);
    
    const challenge = this.add.text(
      centerX,
      centerY - 300, this.getChallenge()
      ,
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 }
      }
    ).setOrigin(0.5);

    this.outputText = this.add.text(
      centerX, 
      centerY, "", {
        fontSize: "28px",
        backgroundColor: "#000000",
        color: "#00ff00",
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    const options = ['[^"]', 'pinosaurus', '*', '[s|S]','spinosaurus', 'S', '["]'];
    const totalSpan = 900; // Total width for all buttons
    const spacing = options.length > 1 ? totalSpan / (options.length - 1) : 0; 
       
    options.forEach((value, index) => {
      const offset = index - (options.length - 1) / 2;
      this.createOptionButton(centerX + offset * spacing, centerY + 300, value);
    });
    const bottomTotalSpan = 200; // Increased for padding between buttons
    const bottomSpacing = bottomTotalSpan / 1; // For 2 buttons
    this.createOptionButton(centerX - bottomSpacing / 2, centerY + 500, "RESET", true);

    this.createButton(centerX + bottomSpacing / 2, centerY + 500, "Continue", () => {
      this.scene.start("Level4Scene");
    });
  }

  createOptionButton(x, y, value, isReset = false) {
    const btn = this.add.text(x, y, value, {
      fontSize: "22px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: 16, y: 8 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));

    btn.on("pointerdown", () => {
      if (isReset) {
        this.outputText.setText("");
      } else {
        this.outputText.setText(this.outputText.text + value);
      }
      const pattern = "^" + this.outputText.text + "$"; 
      const challenge = this.getChallenge();

      let regex  = new RegExp(pattern); // Test if valid regex
      console.log("Regex value", regex);

      let result = (regex.test('"Spinosaurus challenges our understanding of predatory dinosaurs"') &&  regex.test('"Evidence suggests spinosaurus was semi-aquatic"'));
      console.log("Testing regex:", pattern, "\nChallenge:", challenge, "\nResult:", result);


      if (result) {
        console.log("Correct solution entered");
        window.GameState.score += 1; // Increment score
        this.time.delayedCall(500, () => {
          //this.scene.start("Level3Scene"); // Move to next level after a short delay
        });
      }
    });
  }

  createButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#dddddd" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffffff" }));
    btn.on("pointerdown", callback);
  }
}