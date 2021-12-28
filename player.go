package main

type player struct {
	id string
	color string
	pos [2]float64
	vel [2]float64
	angVel float64
	mass float64
}

func (p player) angMom() float64 {
	return p.angVel * p.mass
}
