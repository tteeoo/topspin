package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"path"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/tteeoo/topspin/packet"
)

var addr = flag.String("addr", ":8080", "server address")

var upgrader = websocket.Upgrader{}

var players = map[string]packet.Packet{}

var mutex = &sync.Mutex{}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", wsEndpoint)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path.Join("./client/", r.URL.Path))
	})
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	log.Fatal(http.ListenAndServe(*addr, nil))
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	id := r.RemoteAddr
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}

		var parsed packet
		err = json.Unmarshal(message, &parsed)
		if err != nil {
			log.Println("json:", err)
			break
		}

		mutex.Lock()
		players[id] = parsed
		log.Printf("recv: %s", players)
		var sending []packet
		for v, player := range players {
			if v != id {
				sending = append(sending, player)
			}
		}
		mutex.Unlock()

		b, err := json.Marshal(sending)
		if err != nil {
			log.Println("json:", err)
			break
		}

		err = c.WriteMessage(mt, b)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}
