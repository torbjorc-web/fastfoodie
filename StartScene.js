class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' })
  }

  preload() {
    this.load.image('Start-bg', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Start-bg.png');
    this.load.image('startBtn', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/startBtn.png');
  }

  create() {
    this.add.image(0, 0, 'Start-bg').setOrigin(0);
    
    const startBtn = this.add.image(400, 300, 'startBtn')
      .setInteractive()
      .setScale(0.8);
    
    startBtn.on('pointerdown', () => {
      this.scene.start('TutorialScene');
    });
  }
}
