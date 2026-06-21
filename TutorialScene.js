class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' })
  }

  preload() {
    this.load.image('Tutorial-bg', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Tutorial-bg.png');
    this.load.image('nextBtn', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/nextBtn.png');
  }

  create() {
    this.add.image(0, 0, 'Tutorial-bg').setOrigin(0);
    
    this.add.text(400, 150, 'FASTFOODIE', { 
      fontSize: '64px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.add.text(400, 250, 'A = Burger (5 pts)', { 
      fontSize: '24px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.add.text(400, 290, 'S = Fries (3 pts)', { 
      fontSize: '24px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.add.text(400, 330, 'D = Shake (1 pt)', { 
      fontSize: '24px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.add.text(400, 380, 'ENTER = Serve Customer', { 
      fontSize: '24px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    const nextBtn = this.add.image(400, 500, 'nextBtn')
      .setInteractive()
      .setScale(0.8);
    
    nextBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
