package game

type Player struct {
	Name string `json:"name"`
	ID int `json:"id"`
	Pos [2]float64 `json:"pos"`
	Vel [2]float64 `json:"vel"`
	AngVel float64 `json:"angVel"`
	Mass float64 `json:"mass"`
}

func (p *Player) GetAngMom() float64 {
	return p.AngVel * p.Mass
}
