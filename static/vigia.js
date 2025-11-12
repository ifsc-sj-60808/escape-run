audio = document.querySelector("#audio")
button = document.querySelector("#answer")

iceServers = {
  iceServers: [
    { urls: "stun:feira-de-jogos.dev.br" },
    { urls: "stun:stun.l.google.com:19302" }
  ]
}

navigator.mediaDevices
  .getUserMedia({ video: false, audio: true })
  .then((stream) => {
    remoteConnection = new RTCPeerConnection(iceServers)

    remoteConnection.onicecandidate = ({ candidate }) => {
      socket.emit("candidate", candidate)
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
})

socket.on("offer", (description) => {
  remoteConnection
    .setRemoteDescription(description)
    .then(() => remoteConnection.createAnswer())
    .then((answer) => remoteConnection.setLocalDescription(answer))
    .then(() => socket.emit("answer", remoteConnection.localDescription))
})

socket.on("candidate", (candidate) => {
  remoteConnection.addIceCandidate(candidate)
})
