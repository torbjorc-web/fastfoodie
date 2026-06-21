const gameState = {
  score: 0,
  starRating: 5,
  currentWaveCount: 1,
  customerIsReady: false,
  cam: {},
  gameSpeed: 3,
  currentMusic: {},
  totalWaveCount: 3,
  countdownTimer: 1500,
  customers: null,
  currentMeal: null,
  customersServedCount: 0,
  readyForNextOrder: true,
  currentCustomer: null,
  totalCustomerCount: 0,
  customersLeftCount: 0,
  starGroup: null,
  keys: {},
  sfx: {}
};

// Gameplay scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // Preload images
    const baseURL = 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/';
    this.load.image('Chef', `${baseURL}art/Chef.png`);
    this.load.image('Customer-1', `${baseURL}art/Customer-1.png`);
    this.load.image('Customer-2', `${baseURL}art/Customer-2.png`);
    this.load.image('Customer-3', `${baseURL}art/Customer-3.png`);
    this.load.image('Customer-4', `${baseURL}art/Customer-4.png`);
    this.load.image('Customer-5', `${baseURL}art/Customer-5.png`);
    this.load.image('Floor-Server', `${baseURL}art/Floor-Server.png`);
    this.load.image('Floor-Customer', `${baseURL}art/Floor-Customer.png`);
    this.load.image('Tray', `${baseURL}art/Tray.png`);
    this.load.image('Barrier', `${baseURL}art/Barrier.png`);
    this.load.image('Star-full', `${baseURL}art/Star-full.png`);
    this.load.image('Star-half', `${baseURL}art/Star-half.png`);
    this.load.image('Star-empty', `${baseURL}art/Star-empty.png`);

    // Preload song
    this.load.audio('gameplayTheme', [
      `${baseURL}audio/music/2-gameplayTheme.ogg`,
      `${baseURL}audio/music/2-gameplayTheme.mp3`
    ]);

    // Preload SFX
    this.load.audio('placeFoodSFX', [
      `${baseURL}audio/sfx/placeFood.ogg`,
      `${baseURL}audio/sfx/placeFood.mp3`
    ]);

    this.load.audio('servingCorrectSFX', [
      `${baseURL}audio/sfx/servingCorrect.ogg`,
      `${baseURL}audio/sfx/servingCorrect.mp3`
    ]);

    this.load.audio('servingIncorrectSFX', [
      `${baseURL}audio/sfx/servingIncorrect.ogg`,
      `${baseURL}audio/sfx/servingIncorrect.mp3`
    ]);

    this.load.audio('servingEmptySFX', [
      `${baseURL}audio/sfx/servingEmpty.ogg`,
      `${baseURL}audio/sfx/servingEmpty.mp3`
    ]);

    this.load.audio('fiveStarsSFX', [
      `${baseURL}audio/sfx/fiveStars.ogg`,
      `${baseURL}audio/sfx/fiveStars.mp3`
    ]);

    this.load.audio('nextWaveSFX', [
      `${baseURL}audio/sfx/nextWave.ogg`,
      `${baseURL}audio/sfx/nextWave.mp3`
    ]);
  }

  create() {
    gameState.cam = this.cameras.main;

    // Stop, reassign, and play the new music
    if (gameState.currentMusic) {
      gameState.currentMusic.stop();
    }
    gameState.currentMusic = this.sound.add('gameplayTheme');
    gameState.currentMusic.play({ loop: true });

    // Assign SFX
    gameState.sfx = {};
    gameState.sfx.placeFood = this.sound.add('placeFoodSFX');
    gameState.sfx.servingCorrect = this.sound.add('servingCorrectSFX');
    gameState.sfx.servingIncorrect = this.sound.add('servingIncorrectSFX');
    gameState.sfx.servingEmpty = this.sound.add('servingEmptySFX');
    gameState.sfx.fiveStars = this.sound.add('fiveStarsSFX');
    gameState.sfx.nextWave = this.sound.add('nextWaveSFX');

    // Create environment sprites
    gameState.floorServer = this.add.sprite(gameState.cam.midPoint.x, 0, 'Floor-Server').setScale(0.5).setOrigin(0.5, 0);
    gameState.floorCustomer = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.worldView.bottom, 'Floor-Customer').setScale(0.5).setOrigin(0.5, 1);
    gameState.table = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Barrier').setScale(0.5);

    // Create player and tray sprites
    gameState.tray = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Tray').setScale(0.5);
    gameState.player = this.add.sprite(gameState.cam.midPoint.x, 200, 'Chef').setScale(0.5);

    // Display the score
    gameState.scoreTitleText = this.add.text(gameState.cam.midPoint.x, 30, 'Score', { fontSize: '15px', fill: '#666666' }).setOrigin(0.5);
    gameState.scoreText = this.add.text(gameState.cam.midPoint.x, gameState.scoreTitleText.y + gameState.scoreTitleText.height + 20, gameState.score, { fontSize: '30px', fill: '#000000' }).setOrigin(0.5);

    // Display the wave count
    gameState.waveTitleText = this.add.text(gameState.cam.worldView.right - 20, 30, 'Wave', { fontSize: '64px', fill: '#666666' }).setOrigin(1, 1).setScale(0.25);
    gameState.waveCountText = this.add.text(gameState.cam.worldView.right - 20, 30, gameState.currentWaveCount + '/' + gameState.totalWaveCount, { fontSize: '120px', fill: '#000000' }).setOrigin(1, 0).setScale(0.25);

    // Display number of customers left
    gameState.customerCountText = this.add.text(gameState.cam.worldView.right - 20, 80, `Customers left: ${gameState.customersLeftCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);
    
    // Generate wave group
    gameState.customers = this.add.group();
    gameState.currentMeal = { children: { entries: [] }, fullnessValue: 0 };
    gameState.starGroup = this.add.group();
    
    // Add keyboard keys (Tasks 24-25)
    gameState.keys.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    gameState.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    gameState.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    gameState.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Draw initial stars (Task 40)
    this.drawStars();
    
    this.generateWave();
  }

  update() {
    // Tasks 8-14: Move customers forward in line
    if (gameState.readyForNextOrder) {
      gameState.readyForNextOrder = false; // Task 10
      gameState.customerIsReady = false; // Task 11

      // Task 12: Get current customer
      gameState.currentCustomer = gameState.customers.children.entries[gameState.customersServedCount];

      if (gameState.currentCustomer) {
        // Task 13: Create tween to move customer to front
        this.tweens.add({
          targets: gameState.currentCustomer,
          x: gameState.player.x,
          angle: 90,
          duration: 1000,
          delay: 100,
          ease: 'Power2',
          onComplete: () => {
            // Task 14: Set customer as ready
            gameState.customerIsReady = true;
            gameState.currentCustomer.meterContainer.visible = true; // Task 23
            
            // Task 45: Start timer
            this.startCustomerTimer(gameState.currentCustomer);
          }
        });
      }
    }

    // Tasks 24-34: Handle food placement (A/S/D keys)
    if (Phaser.Input.Keyboard.KeyDown(gameState.keys.A)) {
      this.placeFood('Burger', 5);
    }
    if (Phaser.Input.Keyboard.KeyDown(gameState.keys.S)) {
      this.placeFood('Fries', 3);
    }
    if (Phaser.Input.Keyboard.KeyDown(gameState.keys.D)) {
      this.placeFood('Shake', 1);
    }

    // Task 36: Serve customer (Enter key)
    if (Phaser.Input.Keyboard.KeyDown(gameState.keys.Enter)) {
      if (!gameState.readyForNextOrder && gameState.customerIsReady) {
        this.moveCustomerLine();
      }
    }
  }

  /* WAVES */
  // Generate wave
  generateWave() {
    // Task 3: Randomly generate number of customers (1-10)
    const randomCustomers = Math.ceil(Math.random() * 10);
    gameState.totalCustomerCount = Math.ceil(
      randomCustomers * gameState.currentWaveCount
    );

    // Task 17: Update before creating customers
    this.updateCustomerCountText();

    for (let i = 0; i < gameState.totalCustomerCount; i++) {
      // Task 4: Create container
      let customerContainer = this.add.container(
        gameState.cam.worldView.right + (200 * i),
        gameState.cam.worldView.bottom - 140
      );

      // Task 5: Add to customers group
      gameState.customers.add(customerContainer);

      // Customer sprite randomizer
      let customerImageKey = Math.ceil(Math.random() * 5);

      // Tasks 6-7: Draw customer sprite
      let customer = this.add.sprite(0, 0, `Customer-${customerImageKey}`).setScale(0.5);
      customerContainer.add(customer);

      // Fullness meter container
      customerContainer.fullnessMeter = this.add.group();

      // Define capacity
      customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5 * gameState.totalWaveCount);

      // If capacity is an impossible number, reshuffle it until it isn't
      while (customerContainer.fullnessCapacity === 12 || customerContainer.fullnessCapacity === 14) {
        customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5) * gameState.totalWaveCount;
      }

      // Task 20: Edit the meterWidth
      let meterWidth = customerContainer.fullnessCapacity * 10;
      customerContainer.meterContainer = this.add.container(0, customer.y + (meterWidth / 2));

      // Task 21: Add the meterContainer to customerContainer
      customerContainer.add(customerContainer.meterContainer);

      // Add meter base
      customerContainer.meterBase = this.add.rectangle(-130, customer.y, meterWidth, 33, 0x707070).setOrigin(0);
      customerContainer.meterBase.setStrokeStyle(6, 0x707070);
      customerContainer.meterBase.angle = -90;
      customerContainer.meterContainer.add(customerContainer.meterBase);

      // Add timer countdown meter body
      customerContainer.timerMeterBody = this.add.rectangle(customerContainer.meterBase.x + 22, customer.y + 1, meterWidth + 4, 12, 0x3ADB40).setOrigin(0);
      customerContainer.timerMeterBody.angle = -90;
      customerContainer.meterContainer.add(customerContainer.timerMeterBody);

      // Create container for individual fullness blocks
      customerContainer.fullnessMeterBlocks = [];

      // Task 22: Create fullness meter blocks with correct conditional
      for (let j = 0; j < customerContainer.fullnessCapacity; j++) {
        customerContainer.fullnessMeterBlocks[j] = this.add.rectangle(customerContainer.meterBase.x, customer.y - (10 * j), 10, 20, 0xDBD53A).setOrigin(0);
        customerContainer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB9B42E);
        customerContainer.fullnessMeterBlocks[j].angle = -90;
        customerContainer.fullnessMeter.add(customerContainer.fullnessMeterBlocks[j]);
        customerContainer.meterContainer.add(customerContainer.fullnessMeterBlocks[j]);
      }

      // Task 23: Hide meters initially
      customerContainer.meterContainer.visible = false;
      customerContainer.timer = null;
    }
  }

  // Task 26: Place food method
  placeFood(food, fullnessValue) {
    // Task 27: Check tray capacity and customer readiness
    if (gameState.currentMeal.children.entries.length < 3 && 
        gameState.customerIsReady) {
      
      // Create food sprite
      const foodSprite = this.add.sprite(
        gameState.currentMeal.children.entries.length * 20, 0, food
      ).setScale(0.3);
      gameState.currentMeal.children.entries.push(foodSprite);

      // Task 28: Add to fullness value
      gameState.currentMeal.fullnessValue += fullnessValue;

      // Tasks 29-32: Update meter colors
      this.updateMeterColors();

      // Task 33: Play sound
      gameState.sfx.placeFood.play();
    }
  }

  // Update meter colors based on fullness
  updateMeterColors() {
    const currentFullness = gameState.currentMeal.fullnessValue;
    const capacity = gameState.currentCustomer.fullnessCapacity;

    // Tasks 29-32: Color based on fullness
    for (let i = 0; i < currentFullness; i++) {
      if (i < capacity) {
        const block = gameState.currentCustomer.fullnessMeterBlocks[i];
        
        if (currentFullness === capacity) {
          // Task 30: Exactly full - green
          block.setFill(0x3ADB40);
          block.setStrokeStyle(2, 0x2EB94E);
        } else if (currentFullness > capacity) {
          // Task 31: Too full - red
          block.setFill(0xDB533A);
          block.setStrokeStyle(2, 0xB92E2E);
        } else {
          // Task 32: Not full - yellow-green
          block.setFill(0xFFFA81);
        }
      }
    }
  }

  // Task 45: Start customer timer
  startCustomerTimer(customer) {
    const maxTime = 10000; // 10 seconds
    let currentTime = maxTime;
    
    customer.timer = this.time.addEvent({
      delay: 100,
      callback: () => {
        currentTime -= 100;
        const percentage = currentTime / maxTime;
        
        // Update timer bar width
        customer.timerMeterBody.setWidth(100 * percentage);
        
        // Update color based on time remaining
        if (percentage > 0.75) {
          customer.timerMeterBody.setFill(0x3ADB40); // Green
        } else if (percentage > 0.25) {
          customer.timerMeterBody.setFill(0xFF9D00); // Orange
        } else {
          customer.timerMeterBody.setFill(0xDB533A); // Red
        }
        
        // Task 45: Auto-serve when timer reaches zero
        if (currentTime <= 0) {
          customer.timer.destroy();
          this.moveCustomerLine();
        }
      },
      repeat: maxTime / 100
    });
  }

  // Task 35: Move customer line
  moveCustomerLine() {
    // Reset meal and update counters
    gameState.currentMeal.children.entries = [];
    gameState.currentMeal.fullnessValue = 0;
    gameState.customersServedCount++;
    gameState.readyForNextOrder = true;

    // Task 36: Update text
    this.updateCustomerCountText();

    const currentFullness = gameState.currentMeal.fullnessValue;
    const capacity = gameState.currentCustomer.fullnessCapacity;

    // Tasks 41-43: Evaluate rating and update stars
    this.updateStars(currentFullness, capacity);

    // Tasks 37-38: Tween served customers left
    if (gameState.customersServedCount > 0) {
      for (let i = 0; i < gameState.customersServedCount; i++) {
        const prevCustomer = gameState.customers.children.entries[i];
        if (prevCustomer) {
          this.tweens.add({
            targets: prevCustomer,
            x: prevCustomer.x - 300,
            angle: 0,
            duration: 750
          });
        }
      }
    }

    // Task 39: Tween remaining customers left
    for (let i = gameState.customersServedCount; 
         i < gameState.customers.children.entries.length; i++) {
      const remainingCustomer = gameState.customers.children.entries[i];
      if (remainingCustomer) {
        this.tweens.add({
          targets: remainingCustomer,
          x: remainingCustomer.x - 200,
          delay: 200,
          duration: 1500
        });
      }
    }

    // Task 45: Remove timer if manually served
    if (gameState.currentCustomer.timer) {
      gameState.currentCustomer.timer.destroy();
      gameState.currentCustomer.timer = null;
    }

    // Tasks 46-47: Check for wave completion
    if (gameState.customersServedCount >= gameState.totalCustomerCount) {
      this.destroyWave();
    }
  }

  // Task 40: Draw stars
  drawStars() {
    gameState.starGroup.clear(true);
    
    for (let i = 0; i < gameState.starRating; i++) {
      const star = this.add.sprite(20 + i * 50, 20, 'Star-full').setScale(0.5);
      gameState.starGroup.add(star);
    }
  }

  // Tasks 41-44: Update stars based on rating
  updateStars(fullnessValue, fullnessCapacity) {
    // Task 41: Exactly full
    if (fullnessValue === fullnessCapacity) {
      gameState.currentCustomer.setTint(0x3ADB40);
      gameState.sfx.servingCorrect.play();
      gameState.score += 100;
      gameState.scoreText.setText(gameState.score);
      
      if (gameState.starRating < 5) {
        gameState.starRating++;
      }
      
      if (gameState.starRating === 5) {
        gameState.sfx.fiveStars.play();
      }
    }
    // Task 42: Too hungry
    else if (fullnessValue < fullnessCapacity) {
      gameState.currentCustomer.setTint(0xDB533A);
      gameState.sfx.servingIncorrect.play();
      gameState.starRating -= 2;
    }
    // Task 43: Too full
    else if (fullnessValue > fullnessCapacity) {
      gameState.currentCustomer.setTint(0xDB9B3A);
      gameState.sfx.servingEmpty.play();
      gameState.starRating -= 1;
    }

    // Ensure rating stays valid
    if (gameState.starRating < 0) gameState.starRating = 0;
    if (gameState.starRating > 5) gameState.starRating = 5;

    // Task 44: Redraw stars
    this.drawStars();

    // Task 48: Check for win/lose conditions
    if (gameState.starRating === 0) {
      this.scene.start('LoseScene', { score: gameState.score });
    }
    if (gameState.currentWaveCount >= gameState.totalWaveCount) {
      this.scene.start('WinScene', { score: gameState.score });
    }
  }

  // Task 15-17: Update customer count text
  updateCustomerCountText() {
    gameState.customersLeftCount = 
      gameState.totalCustomerCount - gameState.customersServedCount;
    gameState.customerCountText.setText(
      `Customers left: ${gameState.customersLeftCount}`
    );
  }

  // Task 47: Destroy wave and generate new one
  destroyWave() {
    gameState.sfx.nextWave.play();

    // Tween all customers left one more time
    for (let i = 0; i < gameState.customers.children.entries.length; i++) {
      const customer = gameState.customers.children.entries[i];
      this.tweens.add({
        targets: customer,
        x: customer.x - 300,
        angle: 0,
        duration: 750,
        onComplete: () => {
          // Tween off screen
          this.tweens.add({
            targets: customer,
            x: -500,
            duration: 1000,
            onComplete: () => {
              customer.destroy();
            }
          });
        }
      });
    }

    // Clear group and generate new wave
    gameState.customers.clear(true);
    gameState.currentWaveCount++;
    gameState.gameSpeed *= 0.9; // Increase difficulty
    gameState.readyForNextOrder = true;
    
    // Update wave text
    gameState.waveCountText.setText(`${gameState.currentWaveCount}/${gameState.totalWaveCount}`);
    gameState.waveCountText.setScale(0.3);
    
    setTimeout(() => {
      gameState.waveCountText.setScale(0.25);
      this.generateWave();
    }, 2000);
  }
}
