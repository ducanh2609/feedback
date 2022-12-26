let point = document.getElementsByClassName("point");
let pointIndex;
function getPoint() {
    for (let i = 0; i < point.length; i++) {
        point[i].addEventListener('click', () => {
            for (let j = 0; j < point.length; j++) {
                point[j].style['background-color'] = "rgba(189, 191, 193, 0.489)";
                point[j].style.color = "black";
            }
            point[i].style['background-color'] = "rgb(231, 57, 86)";
            point[i].style.color = "white";
            pointIndex = point[i].innerText;
        })
    }
}
getPoint();

function senData(method, data, message, id) {
    if (data != "") {
        if (data.content == "") {
            err.innerText = "Không được để trống!!!";
        } else if (data.point == undefined) {
            err.innerText = "Bạn phải chọn đánh giá điểm";
        } else {
            err.innerText = "";
            data.point = Number(data.point);
            data.id = Number(data.id);
            let url;
            if (method == "POST") url = '/api/v1/feedbacks';
            else url = `/api/v1/feedbacks/${id}`;
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(async (res) => {
                    let mes = await res.json();
                    alert(`${mes.message}`);
                    if (mes.message == message) {
                        window.location.href = "/";
                    }
                })
        }

    } else {
        fetch(`/api/v1/feedbacks/${id}`, {
            method: method
        })
            .then(async (res) => {
                let mes = await res.json();
                alert(`${mes.message}`);
                if (mes.message == message) {
                    window.location.href = "/";
                }
            })
    }
}
function feedbackTest(method, id) {
    if (id == undefined) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            getPoint();
            if (feedback.style.color != "red") {
                let contentRender = document.getElementsByClassName("content-render");
                let feedbackData = {
                    content: `${feedbackForm.feedbackInput.value}`,
                    point: pointIndex,
                    id: contentRender.length + 1
                }
                senData(method, feedbackData, "Create successfully");
            }
        })
    } else if (method == "PUT") {
        feedbackForm.addEventListener('submit', (e) => {
            getPoint();
            if (feedback.style.color == "red") {
                let feedbackData = {
                    content: `${feedbackForm.feedbackInput.value}`,
                    point: pointIndex,
                    id: id
                }
                senData(method, feedbackData, "Update successfully", id);
            }
        })
    } else {
        senData(method, "", "Delete successfully", id);
    }
}
feedbackTest("POST");


let url = 'http://localhost:3000/api/v1/feedbacks';
fetch(url)
    .then(data => data.json())
    .then((data) => {
        let result = '';
        let totalPoint = 0;
        for (let i = 0; i < data.length; i++) {
            result += `
                <div class="content-render" id='${data[i].id}'>
                    <div class="point-render">${data[i].point}</div>
                    <div class="note-render">${data[i].content}</div>
                    <i class="editFb fa-solid fa-pen-to-square fa-lg"></i>
                    <i class="deleteFb fa-solid fa-xmark fa-lg"></i>
                </div>
            `
            totalPoint += Number(data[i].point);
        }
        fbRender.innerHTML = result;
        view.innerHTML = data.length;
        if (data.length == 0) rating.innerHTML = 0
        else rating.innerHTML = (totalPoint / data.length).toFixed(1);
    })
    .then(() => {
        let editFb = document.getElementsByClassName("editFb");
        let deleteFb = document.getElementsByClassName("deleteFb");
        let noteRender = document.getElementsByClassName("note-render");
        let contentRender = document.getElementsByClassName("content-render");

        for (let i = 0; i < editFb.length; i++) {
            editFb[i].addEventListener('click', () => {
                feedback.value = noteRender[i].innerText;
                feedback.style.color = "red";
                feedbackTest("PUT", contentRender[i].id);
            })
        }

        for (let i = 0; i < deleteFb.length; i++) {
            deleteFb[i].addEventListener('click', () => {
                feedbackTest("DELETE", contentRender[i].id);
            })
        }
    })