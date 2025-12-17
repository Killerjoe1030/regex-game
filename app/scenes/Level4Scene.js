export default class Level4Scene extends Phaser.Scene {
  constructor() {
    super("Level4Scene");
  }

  create() {
    const centerX = this.scale.width / 2;

    this.add.text(
      centerX,
      80,
      "Level 4 Problem Set",
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 }
      }
    ).setOrigin(0.5);

    this.outputText = this.add.text(centerX, 200, "", {
      fontSize: "28px",
      backgroundColor: "#000000",
      color: "#00ff00",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    const options = ["A", "B", "C", "D"];
    options.forEach((value, index) => {
      this.createOptionButton(centerX, 300 + index * 60, value);
    });

    this.createOptionButton(centerX, 600, "RESET", true);

    this.createButton(centerX, 260, "Continue", () => {
      this.scene.start("FinalLevelScene");
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