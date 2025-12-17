/* =========================
   TITLE SCENE
========================= */
class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const centerX = this.scale.width / 2;

    this.add.text(centerX, 120, "Puzzle UI Game", {
      fontSize: "48px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.createButton(centerX, 260, "START GAME", () => {
      this.scene.start("OnboardingScene");
    });

    this.createButton(centerX, 330, "LEADERBOARD", () => {
      alert("Leaderboard coming soon");
    });

    this.createButton(centerX, 400, "QUIT", () => {
      console.log("Quit clicked");
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

/* =========================
   ONBOARDING / PUZZLE SCENE
========================= */
class OnboardingScene extends Phaser.Scene {
  constructor() {
    super("OnboardingScene");
  }

  create() {
    const centerX = this.scale.width / 2;

    this.add.text(
      centerX,
      80,
      "Build the correct string by clicking the options below:",
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
}

/* =========================
   GAME CONFIG (AFTER SCENES)
========================= */
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#1e1e1e",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [TitleScene, OnboardingScene]
};

new Phaser.Game(config);