
        // Função para obter IP local (WebRTC hack)
        function getLocalIP(callback) {
            let ipFound = false;
            let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            if (!RTCPeerConnection) {
                callback('Não suportado');
                return;
            }
            let pc = new RTCPeerConnection({iceServers:[]});
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            pc.onicecandidate = function(event) {
                if (!event || !event.candidate) {
                    if (!ipFound) callback('Não detectado');
                    return;
                }
                let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                let ipMatch = ipRegex.exec(event.candidate.candidate);
                if (ipMatch) {
                    ipFound = true;
                    callback(ipMatch[1]);
                    pc.onicecandidate = null;
                }
            };
        }

        // Mostra IP local
        getLocalIP(function(ip) {
            document.getElementById('ip-local').textContent = ip;
        });

        // Mostra porta (da URL)
        let porta = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
        document.getElementById('porta-local').textContent = porta;

        // Funções de LocalStorage
        function getRegistos() {
            return JSON.parse(localStorage.getItem('registos') || '[]');
        }
        function setRegistos(registos) {
            localStorage.setItem('registos', JSON.stringify(registos));
        }

        // Renderiza tabela
        function renderTabela() {
            const tbody = document.querySelector('#tabela-registos tbody');
            tbody.innerHTML = '';
            const registos = getRegistos();
            registos.forEach((reg, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${reg}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarRegisto(${idx})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Adiciona registo
        document.getElementById('btn-teste').addEventListener('click', function() {
            const agora = new Date().toLocaleString();
            const registos = getRegistos();
            registos.push(agora);
            setRegistos(registos);
            renderTabela();
        });

        // Elimina registo
        window.eliminarRegisto = function(idx) {
            const registos = getRegistos();
            registos.splice(idx, 1);
            setRegistos(registos);
            renderTabela();
        };

        // Inicializa tabela ao carregar
        renderTabela();
