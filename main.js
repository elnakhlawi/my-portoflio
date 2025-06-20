let btn = document.getElementById("helloBton");
let msg = document.getElementById("message");
let contactForm = document.getElementById("contactForm");
let formMsg = document.getElementById("formMsg");
btn.addEventListener("click", (e) => {
  if (msg.textContent == "") {
    msg.textContent = "نورت الدنيا يا منجا 💡";
    btn.innerHTML = "طيب شيل الرساله";
  } else {
    btn.innerHTML = "دوس عليا كده ";
    msg.textContent = "";
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let tel = document.getElementById("tel").value.trim();
  let msgInput = document.getElementById("msgInput").value.trim();

  if (name && email && tel && msgInput) {
    formMsg.textContent = `شكرا  لك يا ${name} علي تواصلك معايه`;
    formMsg.style.cssText = `
      background-color: rgba(94, 224, 94, 0.514);
      font-size: 20px;
      padding: 20px;
      border-radius: 3px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      -ms-border-radius: 3px;
      -o-border-radius: 3px;
      font-weight: bold;`;
    contactForm.reset();
  } else {
    //هيا مالهاش لازمه لان عامل البتونز ريكوايرد بس سيبها مافيش منها خساره
    formMsg.textContent = "من فضلك دخل البيانات المطلوبة ياقمر";
    formMsg.style.cssText = "color:whtie;background-color:red;";
  }
});
