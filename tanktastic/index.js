const preloadScene = {
  key: "preloadScene",
  preload: preloadPreload,
};

const menuScene = {
  key: "menuScene",
  create: createMenu,
};

const mainScene = {
  key: "mainScene",
  create: createMain,
  update: updateMain,
};

const WIDTH = 600;
const HEIGHT = 800;

const config = {
  type: Phaser.AUTO,
  scale: {
    width: WIDTH,
    height: HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [preloadScene, menuScene, mainScene],
};

const direction = {
  RIGHT: 0,
  LEFT: 1,
  UP: 2,
  DOWN: 3,
};

const speed = {
  PLAYER: 150,
  BULLET: 500,
};

const time = {
  PLAYER_INTERVAL: 500,
};

let livesGreenTank = 3;
let livesBlueTank = 3;

let scoreGreenTank = 0;
let scoreBlueTank = 0;

let livesBlueTankText;
let livesGreenTankText;

let greenTankWonText;
let blueTankWonText;

// Green Tank
let greenTank;

let W_key;
let A_key;
let S_key;
let D_key;
let SPACE_key;

// Blue Tank
let blueTank;

let UP_key;
let LEFT_key;
let DOWN_key;
let RIGHT_key;
let NUMPAD_ZERO_key;

let bulletsGroup;
let bricksGroup;
let blocksGroup;
let blueTankGroup;
let greenTankGroup;

let explosion;

var game = new Phaser.Game(config);

function preloadPreload() {
  this.load.spritesheet("greenTank", "./assets/greenTank.png", {
    frameWidth: 150,
    frameHeight: 202,
  });

  this.load.spritesheet("blueTank", "./assets/blueTank.png", {
    frameWidth: 150,
    frameHeight: 202,
  });

  this.load.spritesheet("redTank", "./assets/redTank.png", {
    frameWidth: 150,
    frameHeight: 202,
  });

  this.load.image("bullet", "./assets/bullet.png");
  this.load.image("block", "./assets/block.jpg");
  this.load.image("brick", "./assets/brick.jpg");
  this.load.image("bush", "./assets/bush.png");
  this.load.spritesheet("explosion", "./assets/explosion.png", {
    frameWidth: 256,
    frameHeight: 256,
  });

  this.load.json("map", "./levels/level-1.json");

  console.log("Assets loaded.");

  this.scene.start("menuScene");
}

function createMenu() {
  let titleText = this.add.text(WIDTH / 2, HEIGHT / 2 - 20, "Tanktastic", {
    font: "50px Consolas",
    fill: "#ffffff",
  });
  titleText.setOrigin(0.5, 0.5);

  let startText = this.add.text(
    WIDTH / 2,
    HEIGHT / 2 + 30,
    "Press ENTER to start",
    {
      font: "30px Consolas",
      fill: "#ffffff",
    }
  );
  startText.setOrigin(0.5, 0.5);

  let enterKey = this.input.keyboard.addKey("ENTER");

  const menuScene = this;
  enterKey.on("down", function () {
    menuScene.scene.start("mainScene");
  });

  console.log("Menu created.");
}

function createMain() {
  livesGreenTankText = this.add.text(
    WIDTH / 2,
    20,
    "Green lives: " + livesGreenTank,
    {
      font: "20px Consolas",
      fill: "#ffffff",
    }
  );
  livesGreenTankText.setOrigin(0.5, 0.5);

  livesBlueTankText = this.add.text(
    WIDTH / 2,
    HEIGHT - 20,
    "Blue lives: " + livesGreenTank,
    {
      font: "20px Consolas",
      fill: "#ffffff",
    }
  );
  livesBlueTankText.setOrigin(0.5, 0.5);

  bulletsGroup = this.physics.add.group();
  bricksGroup = this.physics.add.staticGroup();
  blocksGroup = this.physics.add.staticGroup();

  greenTankGroup = this.physics.add.group();
  blueTankGroup = this.physics.add.group();

  explosion = this.physics.add.sprite(1000, 1000, "explosion").setScale(0.5);
  createAnim(this, "explode", "explosion", 0, 33, 90, 0);

  createMap(this);

  greenTank = this.physics.add.image(60, 100, "greenTank");
  greenTank.setScale(0.3);
  greenTank.nextFire = 0;
  greenTankGroup.add(greenTank);

  blueTank = this.physics.add.image(500, 700, "blueTank");
  blueTank.setScale(0.3);
  blueTank.nextFire = 0;
  blueTankGroup.add(blueTank);

  greenTank.direction = direction.DOWN;
  blueTank.direction = direction.DOWN;

  W_key = this.input.keyboard.addKey("W");
  A_key = this.input.keyboard.addKey("A");
  S_key = this.input.keyboard.addKey("S");
  D_key = this.input.keyboard.addKey("D");
  SPACE_key = this.input.keyboard.addKey("SPACE");

  UP_key = this.input.keyboard.addKey("UP");
  LEFT_key = this.input.keyboard.addKey("LEFT");
  DOWN_key = this.input.keyboard.addKey("DOWN");
  RIGHT_key = this.input.keyboard.addKey("RIGHT");
  NUMPAD_ZERO_key = this.input.keyboard.addKey("NUMPAD_ZERO");

  greenTank.setCollideWorldBounds(true);
  blueTank.setCollideWorldBounds(true);

  greenTank.setPushable(false);
  blueTank.setPushable(false);

  this.physics.add.collider(bulletsGroup, bulletsGroup, bulletCollideBullet);
  this.physics.add.collider(bulletsGroup, bricksGroup, bulletCollideBrick);
  this.physics.add.collider(bulletsGroup, blocksGroup, bulletCollideBlocks);
  this.physics.add.collider(greenTankGroup, blueTankGroup);
  this.physics.add.collider(greenTankGroup, [bricksGroup, blocksGroup]);
  this.physics.add.collider(blueTankGroup, [bricksGroup, blocksGroup]);
  this.physics.add.collider(
    bulletsGroup,
    [greenTankGroup, blueTankGroup],
    (bullet, target) => {
      bullet.destroy();
      if (target.texture.key === "greenTank") {
        livesGreenTank -= 1;
        livesGreenTankText.setText("Green lives: " + livesGreenTank);
        if (livesGreenTank == 0) {
          greenTank.disableBody(true, true);
          explosion.x = greenTank.x;
          explosion.y = greenTank.y;
          explosion.anims.play("explode", true);
          blueTankWon(this);
        }
      } else if (target.texture.key === "blueTank") {
        livesBlueTank -= 1;
        livesBlueTankText.setText("Blue lives: " + livesBlueTank);
        if (livesBlueTank == 0) {
          blueTank.disableBody(true, true);
          explosion.x = blueTank.x;
          explosion.y = blueTank.y;
          explosion.anims.play("explode", true);
          greenTankWon(this);
        }
      }
      if (livesBlueTank == 0 && livesGreenTank == 0) {
        nobodyWon(this);
      }
    }
  );
}

function updateMain(currentTime) {
  moveTank(greenTank, W_key, S_key, A_key, D_key);
  moveTank(blueTank, UP_key, DOWN_key, LEFT_key, RIGHT_key);

  bulletOutOfBounds(this);

  if (SPACE_key.isDown) {
    if (currentTime > greenTank.nextFire && livesGreenTank > 0) {
      fire(this, greenTank);
      greenTank.nextFire = currentTime + time.PLAYER_INTERVAL;
    }
  }

  if (NUMPAD_ZERO_key.isDown) {
    if (currentTime > blueTank.nextFire && livesBlueTank > 0) {
      fire(this, blueTank);
      blueTank.nextFire = currentTime + time.PLAYER_INTERVAL;
    }
  }
}

function createAnim(
  context,
  the_key,
  sprite,
  start = 0,
  stop = 3,
  fps = 10,
  rep = -1
) {
  context.anims.create({
    key: the_key,
    frames: context.anims.generateFrameNumbers(sprite, {
      start: start,
      end: stop,
    }),
    frameRate: fps,
    repeat: rep,
  });
}

function greenTankWon(scene) {
  greenTankWonText = scene.add.text(
    WIDTH / 2,
    HEIGHT / 2 - 20,
    "Green WON! Press ENTER",
    {
      font: "45px Consolas",
      fill: "green",
    }
  );
  greenTankWonText.setOrigin(0.5, 0.5);

  restart(scene);
}

function blueTankWon(scene) {
  blueTankWonText = scene.add.text(
    WIDTH / 2,
    HEIGHT / 2 - 20,
    "Blue WON! Press ENTER",
    {
      font: "45px Consolas",
      fill: "blue",
    }
  );
  blueTankWonText.setOrigin(0.5, 0.5);

  restart(scene);
}

function nobodyWon(scene) {
  blueTankWonText.destroy();
  greenTankWonText.destroy();

  let nobodyWonText = scene.add.text(
    WIDTH / 2,
    HEIGHT / 2 - 20,
    "TIE! Press ENTER",
    {
      font: "45px Consolas",
      fill: "white",
    }
  );
  nobodyWonText.setOrigin(0.5, 0.5);

  restart(scene);
}

function bulletCollideBrick(bullet, brick) {
  bullet.destroy();
  brick.destroy();
}

function bulletCollideBlocks(bullet) {
  bullet.destroy();
}

function bulletCollideBullet(bullet1, bullet2) {
  bullet1.destroy();
  bullet2.destroy();
}

function createMap(scene) {
  let { bricks, blocks } = scene.cache.json.get("map");

  bricks.forEach((brick) => {
    const newBrick = scene.add
      .image(brick.x, brick.y, brick.texture)
      .setOrigin(0)
      .setScale(0.1);
    bricksGroup.add(newBrick);
  });

  blocks.forEach((block) => {
    const newBlock = scene.add
      .image(block.x, block.y, block.texture)
      .setOrigin(0)
      .setScale(0.1);
    blocksGroup.add(newBlock);
  });
}

function moveTank(tank, up_key, down_key, right_key, left_key) {
  tank.setVelocity(0);

  if (up_key.isDown) {
    tank.direction = direction.UP;
    tank.rotation = 3.14;
    tank.flipX = false;
    tank.setVelocityY(-speed.PLAYER);
  } else if (down_key.isDown) {
    tank.direction = direction.DOWN;
    tank.rotation = 0;
    tank.flipX = true;
    tank.setVelocityY(speed.PLAYER);
  } else if (right_key.isDown) {
    tank.direction = direction.LEFT;
    tank.rotation = 1.57;
    tank.flipX = true;
    tank.setVelocityX(-speed.PLAYER);
  } else if (left_key.isDown) {
    tank.direction = direction.RIGHT;
    tank.rotation = -1.57;
    tank.flipX = false;
    tank.setVelocityX(speed.PLAYER);
  }
}

function fire(scene, tank) {
  const bullet = scene.physics.add.sprite(tank.x, tank.y, "bullet").setAlpha(0);
  bullet.setScale(3);

  bulletsGroup.add(bullet);

  if (tank.direction == direction.LEFT) {
    bullet.setAlpha(1);
    bullet.setVelocityX(-speed.BULLET);
    bullet.setAngle(-90);
    bullet.setPosition(bullet.x - 30, bullet.y);
  } else if (tank.direction == direction.RIGHT) {
    bullet.setAlpha(1);
    bullet.setVelocityX(speed.BULLET);
    bullet.setAngle(90);
    bullet.setPosition(bullet.x + 30, bullet.y);
  } else if (tank.direction == direction.UP) {
    bullet.setAlpha(1);
    bullet.setVelocityY(-speed.BULLET);
    bullet.setFlipY(false);
    bullet.setPosition(bullet.x, bullet.y - 40);
  } else if (tank.direction == direction.DOWN) {
    bullet.setAlpha(1);
    bullet.setVelocityY(speed.BULLET);
    bullet.setFlipY(true);
    bullet.setPosition(bullet.x, bullet.y + 40);
  }
}

function bulletOutOfBounds(scene) {
  const bullets = bulletsGroup.getChildren();

  bullets.forEach((bullet) => {
    if (
      !Phaser.Geom.Rectangle.Overlaps(
        scene.physics.world.bounds,
        bullet.getBounds()
      )
    ) {
      bullet.destroy();
    }
  });
}

function restart(scene) {
  let ENTER_key = scene.input.keyboard.addKey("ENTER");
  ENTER_key.on("down", function () {
    scene.scene.restart();
    livesBlueTank = 3;
    livesGreenTank = 3;
    ENTER_key.destroy();
  });
}
