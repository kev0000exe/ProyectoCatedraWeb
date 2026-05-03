<script>
  (function (w, d, s, o, f, js, fjs) {
    w["botsonic_widget"] = o;
    w[o] =
      w[o] ||
      function () {
        (w[o].q = w[o].q || []).push(arguments);
      };
    js = d.createElement(s);
    fjs = d.getElementsByTagName(s)[0];
    js.id = o;
    js.src = f;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  })(window, document, "script", "Botsonic", "https://widget.botsonic.com/CDN/botsonic.min.js");

  Botsonic("init", {
    serviceBaseUrl: "https://api-azure.botsonic.ai",
    token: "2468b23b-159c-4314-b16f-dce387a0d7a6",
  });

  
</script>
// Simulamos que al iniciar sesión guardaste el rol en el LocalStorage
const rolUsuario = localStorage.getItem('userRole'); // Ejemplo: 'Admin' o 'User'

if (rolUsuario === 'Admin') {
    // Si es administrador, buscamos la pestaña y la mostramos
    document.getElementById('pestana-admin').style.display = 'block'; // o 'list-item'
}