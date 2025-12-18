export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super("Level4Scene");
    this.buttonSize = { x: 40, y: 20 };
    this.solution = "\\b(Tyran\\s+){2}Tyran\\b"; // Solution for Level 4
    this.payloadText =
      'The Tyrannosaurus rex was feeling dramatic. Tyran Tyran Tyran echoed through the valley as the rex practiced his villain laugh. Some called him a tyrant, others just called him Rex, but everyone agreed that when Tyran Tyran Tyran appeared in the jungle, snacks mysteriously disappeared.';
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // --- UX state ---
    this.isLocked = false;
    this.optionButtons = [];

    // Title
    this.add
      .text(centerX, centerY - 500, "Level 4 - Because I am the CARNIVORE", {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 },
      })
      .setOrigin(0.5);

    // Payload + instructions
    this.add
      .text(
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
          wordWrap: { width: this.scale.width - 100 },
        }
      )
      .setOrigin(0.5);

    // Output (constructed regex)
    this.outputText = this.add
      .text(centerX, centerY, "", {
        fontSize: "28px",
        backgroundColor: "#000000",
        color: "#00ff00",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);

    // Message text (feedback)
    this.feedbackText = this.add
      .text(centerX, centerY + 80, "", {
        fontSize: "26px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Full-screen overlay for red/green flash
    this.feedbackOverlay = this.add
      .rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0)
      .setDepth(999)
      .setVisible(false);

    // Option buttons
    const options = [
      "\\b(Tyran){2}\\sTyran\\b",
      "\\b(Tyran\\s+){2}",
      "\\b(Tyran\\s+){3}",
      "Tyran\\b",
    ];

    const totalSpan = 1400;
    const spacing = options.length > 1 ? totalSpan / (options.length - 1) : 0;

    options.forEach((value, index) => {
      const offset = index - (options.length - 1) / 2;
      this.createOptionButton(centerX + offset * spacing, centerY + 300, value);
    });

    // Bottom buttons: Reset, Submit, Continue
    const bottomY = centerY + 500;
    const bottomSpan = 600;
    const xReset = centerX - bottomSpan / 2;
    const xSubmit = centerX;
    const xContinue = centerX + bottomSpan / 2;

    this.createResetButton(xReset, bottomY, "Reset");
    this.createSubmitButton(xSubmit, bottomY, "Submit");
    this.createContinueButton(xContinue, bottomY, "Continue", () => {
      this.scene.start("FinalLevelScene");
    });

    // Start with Continue disabled (unlock it after correct)
    this.setContinueEnabled(false);
  }

  // ---------------- UX helpers ----------------

  lockUI(ms = 600) {
    this.isLocked = true;
    this.optionButtons.forEach((b) => b.disableInteractive());
    if (this.resetBtn) this.resetBtn.disableInteractive();
    if (this.submitBtn) this.submitBtn.disableInteractive();

    this.time.delayedCall(ms, () => {
      this.isLocked = false;
      // re-enable only the things that should be enabled
      this.optionButtons.forEach((b) => b.setInteractive({ useHandCursor: true }));
      if (this.resetBtn) this.resetBtn.setInteractive({ useHandCursor: true });
      if (this.submitBtn) this.submitBtn.setInteractive({ useHandCursor: true });
    });
  }

  flashOverlay(colorHex) {
    this.feedbackOverlay
      .setFillStyle(colorHex, 0.18)
      .setAlpha(0)
      .setVisible(true);

    this.tweens.add({
      targets: this.feedbackOverlay,
      alpha: { from: 0, to: 1 },
      duration: 140,
      yoyo: true,
      hold: 180,
      onComplete: () => this.feedbackOverlay.setVisible(false),
    });
  }

  setContinueEnabled(enabled) {
    if (!this.continueBtn) return;

    if (enabled) {
      this.continueBtn.setStyle({ backgroundColor: "#ffffff", color: "#000000" });
      this.continueBtn.setInteractive({ useHandCursor: true });
    } else {
      // greyed out
      this.continueBtn.setStyle({ backgroundColor: "#666666", color: "#cccccc" });
      this.continueBtn.disableInteractive();
    }
  }

  // ---------------- Button creators ----------------

  createOptionButton(x, y, value) {
    const btn = this.add
      .text(x, y, value, {
        fontSize: "24px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: { x: this.buttonSize.x, y: this.buttonSize.y },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#dddddd" });
    });
    btn.on("pointerout", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#ffffff" });
    });

    btn.on("pointerdown", () => {
      if (this.isLocked) return;

      // Append token
      this.outputText.setText(this.outputText.text + value);

      // Gentle “added” animation
      this.tweens.add({
        targets: this.outputText,
        scaleX: { from: 1, to: 1.04 },
        scaleY: { from: 1, to: 1.04 },
        duration: 90,
        yoyo: true,
      });

      // Optional: If user is clearly going off-track, give subtle warning.
      // (Doesn't punish; just helps.)
      if (!this.solution.startsWith(this.outputText.text)) {
        this.feedbackText.setText("Hmm… that doesn’t look quite right yet.");
        this.flashOverlay(0xe74c3c);
        this.cameras.main.shake(110, 0.004);
        this.lockUI(450);
      } else {
        this.feedbackText.setText("");
      }
    });

    this.optionButtons.push(btn);
  }

  createResetButton(x, y, label) {
    const btn = this.add
      .text(x, y, label, {
        fontSize: "24px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: { x: this.buttonSize.x, y: this.buttonSize.y },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#dddddd" });
    });
    btn.on("pointerout", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#ffffff" });
    });

    btn.on("pointerdown", () => {
      if (this.isLocked) return;
      this.outputText.setText("");
      this.feedbackText.setText("");
      this.setContinueEnabled(false);
    });

    this.resetBtn = btn;
  }

  createSubmitButton(x, y, label) {
    const btn = this.add
      .text(x, y, label, {
        fontSize: "24px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: { x: this.buttonSize.x, y: this.buttonSize.y },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#dddddd" });
    });
    btn.on("pointerout", () => {
      if (!this.isLocked) btn.setStyle({ backgroundColor: "#ffffff" });
    });

    btn.on("pointerdown", () => {
      if (this.isLocked) return;

      const isCorrect = this.outputText.text === this.solution;

      if (!isCorrect) {
        // Wrong feedback
        this.feedbackText.setText("❌ Not quite — try again!");
        this.flashOverlay(0xe74c3c);
        this.cameras.main.shake(150, 0.006);

        // Brief lock so they notice feedback
        this.lockUI(650);
        return;
      }

      // Correct feedback
      window.GameState.score += 1;
      this.feedbackText.setText("✅ Correct! Nice regex.");
      this.flashOverlay(0x2ecc71);

      // Unlock Continue after a beat
      this.lockUI(900);
      this.time.delayedCall(500, () => {
        this.setContinueEnabled(true);
      });

      // Optional: slower auto-advance (comment out if you want manual Continue)
      this.time.delayedCall(1200, () => {
        this.scene.start("TitleScene");
      });
    });

    this.submitBtn = btn;
  }

  createContinueButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: { x: this.buttonSize.x, y: this.buttonSize.y },
    })
      .setOrigin(0.5);

    // Store reference so we can enable/disable it
    this.continueBtn = btn;

    // We enable interactive when correct; initially disabled in create()
    btn.on("pointerover", () => {
      if (!this.isLocked && btn.input?.enabled) btn.setStyle({ backgroundColor: "#dddddd" });
    });
    btn.on("pointerout", () => {
      if (!this.isLocked && btn.input?.enabled) btn.setStyle({ backgroundColor: "#ffffff" });
    });
    btn.on("pointerdown", () => {
      if (this.isLocked) return;
      callback();
    });
  }
}
