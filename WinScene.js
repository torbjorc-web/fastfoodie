class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' })
  }

  preload() {
    this.load.image('Win-bg', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/Win-bg.png');
    this.load.image('restartBtn', 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/art/restartBtn.png');
  }

  create() {
    const { score } = this.scene.get('GameScene').gameState || { score: 0 };
    
    this.add.image(0, 0, 'Win-bg').setOrigin(0);
    
    this.add.text(400, 200, 'YOU WON!', { 
      fontSize: '64px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.add.text(400, 300, `Score: ${score}`, { 
      fontSize: '48px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    const restartBtn = this.add.image(400, 450, 'restartBtn')
      .setInteractive()
      .setScale(0.8);
    
    restartBtn.on('pointerdown', () => {
      // Reset gameState
      gameState.score = 0;
      gameState.starRating = 5;
      gameState.currentWaveCount = 1;
      gameState.customersServedCount = 0;
      gameState.totalCustomerCount = 0;
      gameState.customersLeftCount = 0;
      
      this.scene.start('StartScene');
    });
  }
}
