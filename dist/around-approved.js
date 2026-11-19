(() => {
  const root = document.querySelector('[data-around]');
  if (!root) return;

  const groups = {
    life: [
      { title: 'Shops', image: 'shop-pyaterochka-client.webp', position: 'center 90%', alt: 'Pyaterochka shop. Client photograph with the pole shadow on the asphalt retouched.' },
      { title: 'Public transport stops', image: 'stop-degtyaritsy.png' },
      { title: 'Schools', image: 'school-green-v2.webp', alt: 'Artistically edited photograph of a school surrounded by greenery' },
      { title: 'Roads and access', image: 'road-pines-client-v2.webp', position: 'center 65%', alt: 'Road through a pine forest in a client photograph.' }
    ],
    rest: [
      { title: 'Vysokovsky Bor', image: 'forest-client-natural.webp', position: 'center 75%', alt: 'Vysokovsky Bor and water between the pines. Client photograph with light colour correction.' },
      { title: 'Pier', image: 'river-edited.webp' },
      { title: 'Volga beach', image: 'shore-client-natural.webp', position: 'center 78%', alt: 'Sandy Volga shore beside a pine forest. Client photograph with light colour correction.' },
      { title: 'Rybinsk', image: 'rybinsk-sunset-v2.webp', alt: 'Artistically edited photograph of Rybinsk at sunset' },
      { title: 'Vysokovsky Bor children’s camp', image: 'camp-edited.webp' }
    ]
  };
  const tabs = [...root.querySelectorAll('[data-around-category]')];
  const gallery = root.querySelector('[data-around-gallery]');
  let category = 'rest';

  function render() {
    gallery.dataset.count = String(groups[category].length);
    tabs.forEach(tab => {
      const selected = tab.dataset.aroundCategory === category;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    gallery.classList.remove('is-changing');
    void gallery.offsetWidth;
    gallery.classList.add('is-changing');
    gallery.replaceChildren(...groups[category].map(item => {
      const card = document.createElement('figure');
      card.className = 'around-card';
      if (item.image === 'stop-degtyaritsy.png') card.classList.add('around-card--stop');
      if (item.image === 'river-edited.webp') card.classList.add('around-card--river');
      const photo = document.createElement('div');
      photo.className = 'around-photo';
      const image = document.createElement('img');
      image.src = `assets/around/${item.image}`;
      image.alt = item.alt || item.title;
      if (item.position) image.style.objectPosition = item.position;
      image.loading = 'lazy';
      image.decoding = 'async';
      photo.append(image);
      const caption = document.createElement('figcaption');
      caption.className = 'around-caption';
      caption.textContent = item.title;
      card.append(photo, caption);
      return card;
    }));
    gallery.scrollLeft = 0;
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    if (category === tab.dataset.aroundCategory) return;
    category = tab.dataset.aroundCategory;
    render();
  }));
  tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    category = tabs[next].dataset.aroundCategory;
    render();
    tabs[next].focus({ preventScroll: true });
  }));
  render();
})();
