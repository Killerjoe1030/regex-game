export default class Level2Scene extends Phaser.Scene {

  constructor() {
    super("Level2Scene");
  }


 getChallenge(){
  return "Velociraptors were cunning predators that roamed the Late Cretaceous plains around 75 million years ago. They were small but incredibly fast, reaching speeds up to 40 km/h and weighing about 15 kilograms. Their most iconic feature was a sickle-shaped claw on each hind leg, measuring roughly 6.5 centimeters long, perfect for slashing prey. Covered in feathers, they looked more like terrifying birds than scaly reptiles, with an estimated 2000 feathers on their bodies. Fossil evidence suggests they hunted in coordinated packs of 3 to 6 individuals, using strategy rather than brute force. Velociraptors had about 80 sharp teeth and keen eyesight, making them efficient hunters. Scientists believe their intelligence rivaled that of modern birds, with a brain size of 40 - 50 grams.";
 }


  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const text = this.add.text(
      centerX,
      centerY - 500,
      "Level 2 Problem Set",
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width }
      }
    ).setOrigin(0.5);
    //Text area showing the payload of the level
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

    //Text area showing the constructed regex string
    this.outputText = this.add.text(
      centerX, 
      centerY, "", {
        fontSize: "28px",
        backgroundColor: "#000000",
        color: "#00ff00",
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    const options = ["km", "\\s", "[A-Z]", "40", "\\/h", "[0-9]"];
    const totalSpan = 600; // Total width for all buttons
    const spacing = options.length > 1 ? totalSpan / (options.length - 1) : 0;

    options.forEach((value, index) => {
      const offset = index - (options.length - 1) / 2;

      this.createOptionButton(centerX + offset * spacing, centerY + 300, value);
    });

    const bottomTotalSpan = 200; // Increased for padding between buttons
    const bottomSpacing = bottomTotalSpan / 1; // For 2 buttons
    this.createOptionButton(centerX - bottomSpacing / 2, centerY + 500, "RESET", true);

    this.createButton(centerX + bottomSpacing / 2, centerY + 500, "Continue", () => {
      this.scene.start("Level3Scene");
    });
    //console.log("this value:", this);
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
      
      let result = regex.test("40 km/h");
      
      //console.log("Testing regex:", pattern, "\nChallenge:", challenge, "\nResult:", result);

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
