package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"path"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/tteeoo/topspin/api"
	"github.com/tteeoo/topspin/game"
)

var addr = flag.String("addr", ":8080", "server address")

var players = make(map[string]*game.Player)
var incID = 0;

var upgrader = websocket.Upgrader{}
var mutex = &sync.Mutex{}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", wsEndpoint)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path.Join("./client/", r.URL.Path))
	})
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	// TODO: get cert and key from flag
	log.Fatal(http.ListenAndServeTLS(*addr, "cert", "key", nil))
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	// Get connection
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	addr := r.RemoteAddr
	defer delete(players, addr)
	defer c.Close()

	// Expect join request:
	// Read packet
	mt, message, err := c.ReadMessage()
	if err != nil {
		log.Println("read:", err)
	}
	// Parse out join request
	var packet api.Packet
	err = json.Unmarshal(message, &packet)
	if err != nil {
		log.Println("json:", err)
	}
	if packet.Type != "JoinRequest" {
		log.Println("bad packet type:", packet.Type)
		return
	}
	var jrq api.JoinRequest
	err = json.Unmarshal([]byte(packet.Data), &jrq)
	if err != nil {
		log.Println("json:", err)
	}
	// Create response
	jres := api.JoinResponse{
		Valid: true,
	}
	b, err := api.ToMarshalledPacket(jres, "JoinResponse")
	if err != nil {
		log.Println("json:", err)
	}
	// Write response
	err = c.WriteMessage(mt, b)
	if err != nil {
		log.Println("write:", err)
	}

	// Send "you" packet:
	// Create player
	players[addr] = &game.Player{
		Name: jrq.Name,
		ID: incID,
		Pos: [2]float64{100, 100},
		Vel: [2]float64{0, 0},
		AngVel: 0.2,
		Mass: 40,
	}
	incID += 1
	// Create packet
	youp := api.You{
		You: *players[addr],
	}
	b, err = api.ToMarshalledPacket(youp, "You")
	if err != nil {
		log.Println("json:", err)
	}
	// Write response
	err = c.WriteMessage(mt, b)
	if err != nil {
		log.Println("write:", err)
	}

	for {
		// Process input packet:
		// Parse packet
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		err = json.Unmarshal(message, &packet)
		if err != nil {
			log.Println("json:", err)
			break
		}
		log.Println(packet)
		// Parse out payload
		if packet.Type != "Input" {
			log.Println("bad packet type:", packet.Type)
			return
		}
		var input api.Input
		err = json.Unmarshal([]byte(packet.Data), &input)
		if err != nil {
			log.Println("json:", err)
		}

		// Validate velocity:
		if (input.Vel[0] > 1 || input.Vel[0] < -1) || (input.Vel[1] > 1 || input.Vel[1] < -1) {
			log.Println("too fast:", addr)
			return
		}

		// Calculate pos, send you and players:
		// Update position
		players[addr].Pos = [2]float64{
			players[addr].Pos[0] + (4 * input.Vel[0]),
			players[addr].Pos[1] + (4 * input.Vel[1]),
		}
		// Create you packet
		youp = api.You{
			You: *players[addr],
		}
		b, err = api.ToMarshalledPacket(youp, "You")
		if err != nil {
			log.Println("json:", err)
		}
		// Send you packet
		err = c.WriteMessage(mt, b)
		if err != nil {
			log.Println("write:", err)
		}
		mutex.Lock()
		// Create players packet
		playerMap := make(map[int]game.Player)
		for key, val := range players {
			if key != addr {
				playerMap[val.ID] = *val
			}
		}
		log.Println(playerMap)
		mutex.Unlock()
		others := api.OtherPlayers{
			Players: playerMap,
		}
		// Send players packet
		b, err = api.ToMarshalledPacket(others, "OtherPlayers")
		if err != nil {
			log.Println("json:", err)
		}
		err = c.WriteMessage(mt, b)
		if err != nil {
			log.Println("write:", err)
		}
	}
}
