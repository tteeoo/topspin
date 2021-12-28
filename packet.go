package main

type packet interface {
	String() string
}

type joinRequest struct {
	name string
	color string
}

type joinResponse struct {
	status bool
	player player
}

type otherPlayers struct {
	players []player
}

type you struct {
	you player
}

type input struct {
	velCoeff [2]int
}

type delPlayer struct {
	id string
}
