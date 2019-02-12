const math3d = require('math3d');

class Player {
	constructor(options){
		this.username = options.username
    this.id = options.id
    this.x = options.x
    this.y = options.y
    this.z = options.z
    this.v = options.v
    this.rotY = options.rotY
    this.keys = options.keys
    this.maxHp = options.maxHp || 1300
    this.currentHp = options.maxHp || 1300
    this.attackDelay = options.attackDelay
    this.delayRemaining = options.attackDelay
    this.maxRange = options.maxRange
    this.attackRating = options.attackRating
    this.actions = [];
    this.playerAccel = 0.01;
  	this.maxSpeed = 0.25;
  	this.maxRot = 0.02;
	}

	calcAttack () {
		let multiplier = 1
    let attackType = 'normal'
    let attackRoll = Math.round(Math.random() * 10)
    if(attackRoll >= 10){
      multiplier = 2
      attackType = 'critical'
    } else if(attackRoll < 10 && attackRoll > 5) {
      multiplier += (attackRoll/20)
      attackType = 'powerful'
    } else if(attackRoll <= 5 && attackRoll > 2) {
      multiplier = (attackRoll/10)
      attackType = 'normal'
    } else {
      multiplier = 0
      attackType = 'miss'
    }
    let damage = Math.round(this.attackRating * multiplier)
		return {damage: damage, attackType: attackType}
	}

	attack (players, io) {
    let target = players.filter((target)=> target.id === this.keys.targetid)[0]
		if(target){
      if(target.id === this.id){
        io.to(this.id).emit('action', {
          player: this.username,
          target: target.username,
          type: 'selfAttack',
          datestamp: Date.now(),
          ops: {}
        })
        return
      }
      let playerv3 = new math3d.Vector3(this.x, this.y, this.z)
      let targetv3 = new math3d.Vector3(target.x, target.y, target.z)
      let distance = playerv3.distanceTo(targetv3)
      if(distance <= this.maxRange){
        let attack = this.calcAttack()
        target.currentHp -= attack.damage
        if(target.currentHp <= 0){
          this.actions.push({
            player: this.username,
            target: target.username,
            datestamp: Date.now(),
            type: 'kill'
          })
          return
        }
        this.actions.push({
          player: this.username,
          target: target.username,
          datestamp: Date.now(),
          type: 'attack',
          ops: {
            type: attack.attackType,
            damage: attack.damage
          }
        })
      } else {
        io.to(this.id).emit('action', {
          player: this.username,
          target: target.username,
          datestamp: Date.now(),
          type: 'outOfRange',
          ops: {}
        })
      }
    }

	}

	calcMovement () {
		if(this.keys.left){ this.rotY -= this.maxRot }
		if(this.keys.right){ this.rotY += this.maxRot }
		if(this.keys.forward && this.v < this.maxSpeed){ this.v += this.playerAccel }
		else if(this.keys.forward && this.v >= this.maxSpeed){ this.v = this.maxSpeed }
		else if(this.keys.backward && this.v >= (this.maxSpeed * -1)){ this.v -= this.playerAccel }
		else { if(Math.abs(this.v) > 0.02) { this.v = (this.v/1.25) } else { this.v = 0 } }
		this.x += this.v * Math.cos(-this.rotY);
		this.z += this.v * Math.sin(-this.rotY);
	}

	update (players, io, actionHandler) {
		this.delayRemaining--
		if(this.keys.attack){
			if(this.delayRemaining <= 0){
				this.attack(players, io)
				this.delayRemaining = this.attackDelay
			}
		}
		this.calcMovement();
		let actions = this.actions
		this.actions = [];
		return actions
	}
}

module.exports = Player;