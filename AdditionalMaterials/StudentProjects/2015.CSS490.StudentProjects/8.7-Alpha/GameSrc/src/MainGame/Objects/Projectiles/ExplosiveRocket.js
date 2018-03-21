/* 
 * Team 7-Alpha
 * CSS 490C
 * 2D Game Engine Design
 * File: Rocket.js 
 * 
 * This is the file encapsulates the rocket object
 */

function ExplosiveRocket(atX, atY) {
    this.kExplosiveRocketImage = "assets/explosiveRocket.png";
    this.kParticleTexture = "assets/explosion.png";
    this.hasCollided = false;
    this.kDamage = 1;
    this.mExplosiveRocket = new LightRenderable(this.kExplosiveRocketImage);

    this.kRocketSound1 = "assets/sounds/politeRocket1.wav";
    this.kRocketSound2 = "assets/sounds/politeRocket2.wav";
    this.kRocketSound3 = "assets/sounds/politeRocket3.wav";
    this.randomValue = Math.random() * 100;
    if (this.randomValue < 25) {
        gEngine.AudioClips.playACue(this.kRocketSound1);
    }
    if (this.randomValue >= 25 && this.randomValue < 80) {
        gEngine.AudioClips.playACue(this.kRocketSound2);
    }
    if (this.randomValue >= 80) {
        gEngine.AudioClips.playACue(this.kRocketSound3);
    }
    
    // Define how far below center particles are emitted
    this.kParticleOffset = 3;

    //this.mExplosiveRocket.setColor([1, 0.2, 0.2, 1]);
    this.mExplosiveRocket.getXform().setPosition(atX, atY);
    this.mExplosiveRocket.getXform().setSize(3.5, 3);
    this.mExplosiveRocket.getXform().setZPos(2);
    this.mExplosiveRocket.getXform().setRotationInDegree(0.01);
    
    this.mUpSpeed = 0.6;
    GameObject.call(this, this.mExplosiveRocket);
}
gEngine.Core.inheritPrototype(ExplosiveRocket, GameObject);

ExplosiveRocket.prototype.getRocketType = function () {return 'X';};
ExplosiveRocket.prototype.setUpSpeed = function (inSpeed) { this.mUpSpeed = inSpeed; };
ExplosiveRocket.prototype.update = function () {
    var xform = this.getXform();
    xform.incYPosBy(this.mUpSpeed);
    
    // Create a particle
    var p = this._createParticle(xform.getXPos(), 
            xform.getYPos() - this.kParticleOffset);
    gAllParticles.addToSet(p);
    
    // remember to update this.mMinion's animation
    this.mExplosiveRocket.updateAnimation();
};

ExplosiveRocket.prototype.checkAsteroidCollision = function (fieldObject) {
    var touchPosition = []; // can use this later to spawn explosion renderable
    
    if (fieldObject.getObjectType() === 'A') {
    // current implementation sets hasCollided to true on this rocket and target asteroid
    if (this.hasCollided === false && !fieldObject.getToRemove()) {
        if (GameObject.prototype.pixelTouches.call(this, fieldObject, touchPosition)) {
            this.hasCollided = true;
            fieldObject.getSubObject().doDamage(this.kDamage);
            }
        }
    }
    
    if (this.hasCollided === true) {
        
    }
};

ExplosiveRocket.prototype.getCollisionStatus = function () {
    return this.hasCollided;
};

ExplosiveRocket.prototype._createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 10;
    var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);
    //p.getRenderable().setColor([0, 0, 0, 0]);
    
    // size of the particle
    var r = 2.5 + Math.random() * 0.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.9]);
    
    // velocity on the particle
    var fx = 10 - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getPhysicsComponent().setVelocity([fx, fy]);
    p.getPhysicsComponent().setAcceleration([0,0]); // No gravity affect in space
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};