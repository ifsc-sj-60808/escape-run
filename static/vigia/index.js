setInterval(() => {
  document.body.style.visibility =
    document.body.style.visibility === "hidden" ? "visible" : "hidden"
}, 1000)

audio = document.querySelector("#audio")
room = "vigia"

iceServers = {
  iceServers: [
    {
      urls: "turns:feira-de-jogos.dev.br",
      username: "adc20252",
      credential: "adc20252"
    },
    { urls: "stun:feira-de-jogos.dev.br" },
    { urls: "stun:stun.l.google.com:19302" }
  ]
}

navigator.mediaDevices
  .getUserMedia({ video: false, audio: true })
  .then((stream) => {
    remoteConnection = new RTCPeerConnection(iceServers)

    remoteConnection.onicecandidate = ({ candidate }) => {
      socket.emit("candidate", room, candidate)
    }

    remoteConnection.ontrack = ({ streams: [stream] }) => {
      audio.srcObject = stream
    }

    stream.getTracks().forEach((track) => {
      remoteConnection.addTrack(track, stream)
    })
  })
  .catch((error) => console.error(error))

socket = io()

socket.on("connect", () => {
  console.log(`Usuário ${socket.id} conectado no servidor`)
  socket.emit("join", room)
})

socket.on("offer", (description) => {
  window.alert("Chamada recebida!")
  remoteConnection
    .setRemoteDescription(description)
    .then(() => remoteConnection.createAnswer())
    .then((answer) => remoteConnection.setLocalDescription(answer))
    .then(() => socket.emit("answer", room, remoteConnection.localDescription))
})

socket.on("candidate", (candidate) => {
  remoteConnection.addIceCandidate(candidate)
})
