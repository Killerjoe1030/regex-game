export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const centerX = this.scale.width / 2;

    this.add.text(centerX, 120, "REGEX Puzzle Game", {
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