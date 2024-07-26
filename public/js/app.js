(() => {
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

const pencarian = document.getElementById('pencarian')
const pencarianPinjam = document.getElementById('pencarianPinjam')
const items = document.querySelectorAll('tbody tr')
const ket = document.getElementById('ket')

pencarian.addEventListener('input', (e) => filterData(e.target.value))

function filterData (search) {
  items.forEach((item) => {
    if(item.innerText.toLowerCase().includes(search.toLowerCase())){
      item.classList.remove('d-none')
    } else {
      item.classList.add('d-none')
    }
  })
}


setTimeout(function () {
  $('#alert').addClass('d-none')
},1500)


$('.open-btn').on('click', function(){
    $('.sidebar').addClass('active')
})

$('.close-btn').on('click', function(){
    $('.sidebar').removeClass('active')
})

$('.kategori ul li').on('click', function() {
    $('.kategori ul li.active').removeClass('active')
    $(this).addClass('active')
})

