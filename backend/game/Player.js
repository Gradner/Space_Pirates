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
        this.maxRange = options.maxRange
        this.attackRating = options.attackRating
	}
}

module.exports = Player;