const apiResponse = () => {
    let token = 'd7c01847de4c083cb154e9a533294301e9f05f93dbae7d589e42ece63226c0a3';
    fetch(`https://gorest.co.in/public/v1/users`, {
        headers: {
            Authorization: 'Bearer ' + token,
        }
    })
        .then(res => res.json())
        .then(userData => {
            let ul = document.getElementById('user');
            for (const user of userData.data) {
                let li = document.createElement('li');
                li.innerHTML = user.name;
                ul.appendChild(li);
            }

        })
}

apiResponse();