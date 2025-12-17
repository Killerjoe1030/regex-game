import TitleScene from "./scenes/TitleScene.js";
import OnboardingScene from "./scenes/OnboardingScene.js";
import Level1Scene from "./scenes/Level1Scene.js";
import Level2Scene from "./scenes/Level2Scene.js";
import Level3Scene from "./scenes/Level3Scene.js";
import Level4Scene from "./scenes/Level4Scene.js";
import FinalLevelScene from "./scenes/FinalLevelScene.js";

window.GameState = {
  score: 0
};

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#1e1e1e",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [TitleScene, OnboardingScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, FinalLevelScene]
};

new Phaser.Game(config);