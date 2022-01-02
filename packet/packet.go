package packet

import (
	"github.com/tteeoo/topspin/game"
)

type Packet interface {
	String() string
}

type JoinRequest struct {
	name string
	color string
}

type JoinResponse struct {
	status bool
	player game.Player
}

type OtherPlayers struct {
	players []game.Player
}

type You struct {
	you game.Player
}

type Input struct {
	velCoeff [2]int
}

type DelPlayer struct {
	id string
}
