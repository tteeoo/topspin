package api

import (
	"encoding/json"
	"github.com/tteeoo/topspin/game"
)

type Packet struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

type JoinResponse struct {
	Valid bool `json:"valid"`
}

type OtherPlayers struct {
	Players map[int]game.Player `json:"players"`
}

type You struct {
	You game.Player `json:"you"`
}

type DelPlayer struct {
	ID string `json:"id"`
}

type JoinRequest struct {
	Name string `json:"name"`
}

type Input struct {
	Vel [2]float64 `json:"vel"`
}

func ToMarshalledPacket(payload interface{}, typeString string) ([]byte, error) {
	b, err := json.Marshal(payload)
	if err != nil {
		return []byte{}, err
	}
	p := Packet{
		Type: typeString,
		Data: string(b),
	}
	b, err = json.Marshal(p)
	if err != nil {
		return []byte{}, err
	}
	return b, nil
}
