let allDemos = [];
const allKeys = {
    session: [],
}
const filters = {
    session: null,
};

// const persistor = new Persistor('Mini-Conf-Music');

const updateCards = (papers) => {

    const all_mounted_cards = d3.select('.demo-cards')
      .selectAll('.myCard', openreview => openreview.UID)
      .data(papers, d => d.number)
      .join('div')
      .attr('class', 'myCard col-12 col-sm-6 col-md-4')
      .html(card_html)

    all_mounted_cards.select('.card-title')
      .on('click', function (d) {
          const iid = d.id;
          all_mounted_cards.filter(d => d.id === iid)
            .select(".checkbox-paper").classed('selected', function () {
              const new_value = true;//!d3.select(this).classed('not-selected');
              // readCard(iid, new_value);
              return new_value;
          })
      })

    all_mounted_cards.select(".checkbox-paper")
      .on('click', function (d) {
          const iid = d.id;
          const new_value = !d3.select(this).classed('selected');
          readCard(iid, new_value);
          d3.select(this).classed('selected', new_value)
      })


    lazyLoader();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const render = () => {
    const f_test = [];

    updateSession();

    Object.keys(filters)
      .forEach(k => {filters[k] ? f_test.push([k, filters[k]]) : null})

    console.log(f_test, filters, "--- f_test, filters");
    if (f_test.length === 0) updateCards(allDemos)
    else {
        const fList = allDemos.filter(
          d => {
              let i = 0, pass_test = true;
              while (i < f_test.length && pass_test) {
                  if (f_test[i][0] === 'titles') {
                      pass_test &= d.content['title'].toLowerCase()
                        .indexOf(f_test[i][1].toLowerCase()) > -1;

                  } else {
                      pass_test &= d[f_test[i][0]].indexOf(
                        f_test[i][1]) > -1
                  }
                  i++;
              }
              return pass_test;
          });
        // console.log(fList, "--- fList");
        updateCards(fList)
    }
    // console.log([...new Set(allKeys['session_name'])]);
}


const start = () => {
    const urlFilter = getUrlParameter("session");
    setQueryStringParameter("session", urlFilter);
    updateFilterSelectionBtn(urlFilter)
    // console.log('start');


    d3.json('demos.json').then(demos => {
        console.log(demos, "--- demos");

        shuffleArray(demos);
        //
        allDemos = demos;
        calcAllKeysSimple(allDemos, allKeys);
        uniqueSessions = [...new Set(allKeys['session'])];
        uniqueSessions = uniqueSessions.sort((a,b) => a - b);
        // console.log(uniqueSessions);
        render();

    }).catch(e => console.error(e))
}

const updateFilterSelectionBtn = value => {
    d3.selectAll('.filter_option label')
      .classed('active', function () {
          const v = d3.select(this).select('input').property('value')
          return v === value;
      })
    // sessionSearch();
}

const updateSession = () => {
    const urlSession = getUrlParameter("session");
    if (urlSession) {
        filters['session'] = urlSession
        return true;
    } else {
        filters['session'] = null
        return false;
    }
}

d3.selectAll('.filter_option input').on('click', function () {
    const me = d3.select(this)

    const filter_mode = me.property('value');
    setQueryStringParameter("session", filter_mode);
    updateFilterSelectionBtn(filter_mode);
    render();
})

const card_html = openreview => {
    return `
      <div class="music-card m-4">
      <a href="music_${openreview.UID}.html" class="image-wrapper mb-3">
        <img src="static/images/music_headshots/${openreview.UID}.jpg"/>
      </a>
      <h3><a href="demo_${openreview.UID}.html">${openreview.content.title}</a></h3>
      <h4>${openreview.content.authors.join(', ')}</h4>
      </div>`
}
