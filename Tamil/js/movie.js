const DEFAULT_VIDEO_ID    = "2c80r6Uubew";
const DEFAULT_YOUTUBE_URL = `https://www.youtube.com/embed/${DEFAULT_VIDEO_ID}?enablejsapi=1`;

const VIDEO_INFO_KEY_LIST = new Set([ 'title', 'author_name' ]);
const ENGLISH_TYPE_LIST = [ 'person' ];
const CC = [ 'I', 'R', 'D', 'V' ];
const OF = [ 'F' ];
const FF = { 'person'  : [ 'movie', 'M', [ 'Y' ], [ 'year'   ] ],
             'movie'   : [ 'year',  'Y', [ 'P' ], [ 'person' ] ],
             'year'    : [ 'movie', 'M', [ 'P' ], [ 'person' ] ]
           };
const MOVIE_ICON_DICT = { 'movie'  : 'film',
                          'year'   : 'calendar-date',
                          'person' : 'person-fill'
                        };
const SEARCH_MAP_DICT = { 'c' : 's', 'p' : 'b' };
const IMAGE_MAP       = { 'm' : 'maxresdefault.jpg', 'h' : 'hqdefault.jpg', 's' : 'sddefault.jpg',
                          'm2' : 'maxres2.jpg', 'h2' : 'hq2.jpg', 's2' : 'sd2.jpg',
                          'sw' : 'sddefault.webp', 'sl' : 'sddefault_live.jpg'
                        };

function sleep(seconds){
    const waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}

function capitalize_word(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function get_yt_image(image) {
    return `https://i.ytimg.com/vi/${image}.jpg`;
}

async function fetch_url(url) {
    let url_data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log('Fetch Error:', response.status);
        }
        url_data = await response.json();
    } catch(error) {
        console.log('Fetch Error:', error);
    }
    return url_data;
}

function get_bs_modal(id) {
    return new bootstrap.Modal(document.getElementById(id));
}

function plain_get_html_text(id) {
    return document.getElementById(id).innerHTML;
}

function plain_set_html_text(id, text) {
    document.getElementById(id).innerHTML = text;
}

function plain_add_class(id, name) {
    const element = document.getElementById(id);
    element.classList.add(name);
}

function plain_remove_class(id, name) {
    const element = document.getElementById(id);
    element.classList.remove(name);
}

function plain_get_attr(id, key) {
    const element = document.getElementById(id);
    return element.getAttribute(key);
}

function plain_set_attr(id, key, value) {
    const element = document.getElementById(id);
    element.setAttribute(key, value);
}

function plain_get_background_color(id) {
    const element = document.getElementById(id);
    return element.style.backgroundColor;
}

function plain_set_background_color(id, value) {
    let element = document.getElementById(id);
    element.style.backgroundColor = value;
}

function plain_get_query_selector(phrase) {
    return document.querySelectorAll(phrase);
}

function call_modal_dialog(title) {
    plain_set_html_text('DIALOG_TITLE', title);
    get_bs_modal('DIALOG_BOX').show();
}

function show_modal_dialog(title, body) {
    plain_set_html_text('DIALOG_BODY', body);
    call_modal_dialog(title);
    setTimeout(function() { get_bs_modal('DIALOG_BOX').hide(); }, 3000);
}

function render_card_template(template_name, id, data) {
    const ul_template = plain_get_html_text(template_name);
    const template_html = (data !== undefined) ? Mustache.render(ul_template, data) : ul_template;
    plain_set_html_text(id, template_html);
}

function render_modal_dialog(title, template, data) {
    render_card_template(template, 'DIALOG_BODY', data);
    call_modal_dialog(title);
}

function onYouTubeIframeAPIReady() {
    window.yt_player = new YT.Player('FRAME_PLAYER', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('FRAME_PLAYER').style.borderColor = '#FF6D00';
}

last_player_status = 0;
function onPlayerStateChange(event) {
    const player_status = event.data;
    // playerStatus: -1 : unstarted, 0 - ended, 1 - playing, 2 - paused, 3 - buffering, 5 - video cued
    if (last_player_status === 3 && player_status === -1) {
        // show_modal_dialog('Video is not playable', 'Click Play List to Delete Movie');
    }
    if (player_status === 0) play_next();
    // console.log(`Player Status ${player_status} last: ${last_player_status}`);
    last_player_status = player_status;
}

function youtube_player_init() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function get_play_list() {
    let new_play_list = sessionStorage['playlist'];
    new_play_list = (new_play_list === undefined) ? [] : JSON.parse(new_play_list);
    return new_play_list;
}

function play_first() {
    const play_list = get_play_list();
    if (play_list.length <= 0) return;
    const parts = play_list[0].split(':');
    const video_id = parts[0];
    const v_list = video_id.split('&');
    let time_option = { videoId: v_list[0] };
    if (v_list.length >= 2) {
        time_option['startSeconds'] = parseInt(v_list[1].replace('start=', ''));
    }
    if (v_list.length >= 3) {
        time_option['endSeconds'] = parseInt(v_list[2].replace('end=', ''));
    }
    window.yt_player.loadVideoById(time_option);
}

function play_next() {
    const play_list = get_play_list();
    play_list.shift();
    sessionStorage['playlist'] = JSON.stringify(play_list);
    play_first();
}

function on_storage_event(storageEvent) {
    const play_list = get_play_list();
    if (play_list.length === 0) return;
    if (play_list.length > 1) {
        show_modal_dialog('Movie added to Play List', 'Click Play List to Add/Delete Movies');
        return;
    }
    play_first();
}

function load_menu_data(lang) {
    const item_list = CATEGORY_DICT['categories'];
    const map_info_data = get_map_data('MAP_INFO_DICT');
    const map_dict = map_info_data[lang];
    for (const obj of item_list) {
        const name = capitalize_word(obj['C']);
        obj['N'] = (lang === 'English') ? name : map_dict[name];
    }
    let playlist = 'Playlist';
    let search = 'Search';
    if (lang !== 'English') {
        playlist = map_dict[playlist];
        search = map_dict[search];
    }
    const lang_list = [];
    for (let l in MAP_LANG_DICT) {
        let d = (l === window.GOT_LANGUAGE) ? { 'N' : l, 'O' : 'selected' } : { 'N' : l };
        lang_list.push(d);
    }
    const search_tooltip = 'Prefix Search <br/> e.g. radu daya <br/> Phonetic Search <br/> e.g. goula <br/> Language Search <br/> e.g. கல்யாணி <br/> Context Search <br/> e.g. mdr : kalyani : dikshitar';
    const mic_tooltip = 'Only in Chrome';
    const kbd_tooltip = 'Language Keyboard';
    const menu_dict = { 'menus' : { 'LANGUAGE' : window.GOT_LANGUAGE, 'languages' : lang_list,
                                    'S' : search, 'APP' : 'Android App', 'P' : playlist,
                                    'B' : 'Brightness', 'BI' : 'brightness-high-fill',
                                    'STP' : search_tooltip, 'MTP' : mic_tooltip, 'KTP' : kbd_tooltip,
                                    'categories' : CATEGORY_DICT['categories'] }
                      };
    render_card_template('page-menu-template', 'MENU_DATA', menu_dict);
    init_search_listener();

    set_link_initial_active_state()

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    speech_to_text_init();
}

function check_for_english_text(lang, category, h_id, h_text) {
    if (lang !== 'English') return false;
    if (category === 'type' && h_text === 'Englishnote') return true;
    if (ENGLISH_TYPE_LIST.includes(category)) return true;
    if (category !== 'movie') return false;
    if (h_id >= 20000) return true;
    if (h_text.includes(' - ')) return true;
    return false;
}

function info_transliteration(category, data_list) {
    const lang = window.RENDER_LANGUAGE;
    const map_info_data = get_map_data('MAP_INFO_DICT');
    const map_dict = map_info_data[lang];
    const map_month_data = get_map_data('MAP_MONTH_DICT');
    let item = data_list['title']
    const h_text = item['H'];
    if (category === 'about') {
        if (lang !== 'English') {
            item['N'] = map_dict[item['N']];
        }
    } else if (check_for_english_text(lang, category, 200, h_text)) {
        item['N'] = h_text;
    } else {
        let value = item['V'];
        item['N'] = get_transliterator_text(lang, value);
    }
    let item_list = data_list['stats']
    if (item_list === undefined) item_list = [];
    for (const obj of item_list) {
        let name = obj['H'];
        obj['N'] = (lang === 'English') ? name : map_dict[name];
    }
    const note_list = new Set();
    item_list = data_list['info']
    if (item_list === undefined) item_list = [];
    for (const obj of item_list) {
        const name = obj['H'];
        obj['N'] = (lang !== 'English' && name in map_dict) ? map_dict[name] : name;
        let value = obj['V'];
        if (name === 'Language') {
            if (lang !== 'English' && name in map_dict) {
                obj['V'] = map_dict[value];
            }
        } else if (KEY_NAME_LIST.includes(name)) {
            obj['V'] = get_transliterator_text(lang, value);
        } else if (name === 'Born' || name === 'Died') {
            if (value !== undefined && typeof value === 'string') {
                let m_list = [];
                if (value.includes(' ')) {
                    m_list = value.split(' ');
                }
                if (m_list.length > 1 && lang in map_month_data && m_list[1] in map_month_data[lang]) {
                    obj['V'] = m_list[0] + ' ' + map_month_data[lang][m_list[1]] + ' ' + m_list[2];
                }
            }
        } else if (lang !== 'English' && name in map_dict) {
            value = obj['P'];
            if (value !== undefined) {
                obj['V'] = get_transliterator_text(lang, value);
            }
        }
    }
}

function set_language(got_lang, name_lang) {
    window.GOT_LANGUAGE = got_lang;
    const lang = MAP_LANG_DICT[got_lang];
    window.RENDER_LANGUAGE = lang;
    const history_data = window.history_data;
    // console.log(`SET LANG: ${lang} ${got_lang} ${history_data}`);
    transliterator_lang_init(lang);
    load_menu_data(lang);
    load_nav_data(window.NAV_CATEGORY);
    if (history_data === undefined) {
        load_content_data(window.CONTENT_CATGEGORY, window.CONTENT_NAME);
    } else  {
        handle_history_context(history_data);
    }
}

function toggle_icon(id, old_class, new_class) {
    plain_remove_class(id, old_class);
    plain_add_class(id, new_class);
}

function toggle_brightness() {
    window.COLOR_SCHEME = (window.COLOR_SCHEME === 'dark') ? 'light' : 'dark';
    const elements = document.getElementsByTagName('html');
    elements[0].setAttribute('data-bs-theme', window.COLOR_SCHEME);
    if (window.COLOR_SCHEME === 'dark') toggle_icon('BRIGHTNESS', 'bi-moon-fill', 'bi-brightness-high-fill');
    else toggle_icon('BRIGHTNESS', 'bi-brightness-high-fill', 'bi-moon-fill');
}

function add_movie(audio_file, script_mode) {
    const play_list = get_play_list();
    if (play_list.length <= 0) {
        if (audio_file !== '') play_list[0] = audio_file;
    } else {
        play_list[play_list.length] = audio_file;
    }
    sessionStorage['playlist'] = JSON.stringify(play_list);
    if (play_list.length === 1) {
        play_first();
    } else  if (!script_mode) {
        show_modal_dialog('Movie added to Play List', 'Click Play List to Add/Delete Movies');
    }
}

function delete_movie(movie_id) {
    const play_list = get_play_list();
    if (play_list.length > 0) {
        movie_id = parseInt(movie_id);
        play_list.splice(movie_id, 1);
        sessionStorage['playlist'] = JSON.stringify(play_list);
        if (movie_id === 0) play_first();
    }
}

function delete_row(row) {
    const row_id = row.parentNode.parentNode.rowIndex;
    handle_playlist_command('delete', row_id - 1);
    document.getElementById('PLAYLIST_TABLE').deleteRow(row_id);
}

function create_jukebox(value) {
    setTimeout(function() { create_jukebox_modal(value); }, 0);
}

function show_playlist() {
    const play_list = get_play_list();
    const info_list = [];
    for (const [i, video] of play_list.entries()) {
        const parts = video.split(':');
        info_dict = { 'N' : i + 1, 'I' : parts[0], 'M' : parseInt(parts[1]), 'P' : parseInt(parts[2]) };
        get_folder_value('movie', info_dict, 'M', 'M');
        info_list.push(info_dict);
    }
    const lang = window.RENDER_LANGUAGE;
    const map_info_data = get_map_data('MAP_INFO_DICT');
    const map_dict = map_info_data[lang];
    let header_dict = { 'N' : 'No.', 'I' : 'ID', 'MN' : 'Movie', 'PN' : 'Person' };
    let title = 'Playlist';
    if (lang !== 'English') {
        const map_dict = map_info_data[lang];
        title = map_dict[title];
        header_dict = { 'N' : 'No.', 'I' : 'ID', 'MN' : map_dict['Movie'], 'PN' : map_dict['Person'] };
    }
    title = '';
    const title_template = plain_get_html_text('modal-playlist-title-template');
    const JUKEBOX_LIST = [ { 'N' : 'Popularity' }, { 'N' : 'Views' }, { 'N' : 'Person' }, { 'N' : 'Movie' } ];
    const template_html = Mustache.render(title_template, { 'jukebox' : JUKEBOX_LIST });
    title = '<div class="row"><div class="col">' + title + '</div>' + template_html + ' </div>';
    const header_list = [ header_dict ];
    const list_data = { 'playlist' : { 'header' : header_list, 'videos' : info_list } };
    render_modal_dialog(title, 'modal-playlist-template', list_data)
}

function handle_playlist_command(cmd, arg) {
    if (cmd === 'play') {
        add_movie(arg, false);
    } else if (cmd === 'delete') {
        delete_movie(arg);
    } else if (cmd === 'show') {
        show_playlist();
    }
    return true;
}

function render_nav_template(category, data) {
    const lang = window.RENDER_LANGUAGE;
    const letter_list = data['alphabet'];
    const no_transliterate = lang === 'English';
    const id_data = window.ID_DATA[category];
    const poster_data = window.ABOUT_DATA[category];
    const need_poster = category === 'person';
    for (const l_item of letter_list) {
        const letter = l_item['LL'];
        l_item['TL'] = get_transliterator_text(lang, letter);
        const item_list = l_item['items'];
        for (const obj of item_list) {
            const h_id = obj['H'];
            const h_text = id_data[h_id][0];
            let f_text = id_data[h_id][1];
            obj['H'] = h_text;
            if (check_for_english_text(lang, category, h_id, f_text)) {
                obj['N'] = h_text;
            } else {
                obj['N'] = (no_transliterate) ? h_text : get_transliterator_text(lang, f_text);
            }
            if (need_poster) {
                const image_name = poster_data[h_id]
                if (image_name !== undefined) {
                    obj['J'] = `Images/${image_name}.jpg`;
                }
            }
        }
    }
    const ul_template = plain_get_html_text('nav-data-template')
    const template_html = Mustache.render(ul_template, data);
    plain_set_html_text('MENU', template_html);
    if (window.NAV_SCROLL_SP !== null && window.NAV_SCROLL_SP !== undefined) {
        window.NAV_SCROLL_SP.refresh();
    } else {
        const scroll_element = document.getElementById('ALPHABET_DATA');
        window.NAV_SCROLL_SPY = new bootstrap.ScrollSpy(scroll_element, { target: '#ALPHABET_LIST' });
        const scrollspy = document.querySelector('[data-bs-spy="scroll"]')
        scrollspy.addEventListener('activate.bs.scrollspy', (e) => {
            const a_list = plain_get_query_selector('a');
        })
    }
}

function load_about_data(category, video_data) {
    info_transliteration(category, video_data);
    render_card_template('page-title-template', 'PAGE_TITLE', video_data);
    render_card_template('page-about-template', 'PAGE_INFO', video_data);
    render_data_template('', '', video_data);
}

function load_nav_fetch_data(category, url_data) {
    if (category === 'about') {
        load_about_data(category, url_data);
    } else {
        render_nav_template(category, url_data);
    }
    add_history('nav', { 'category' : category });
}

function set_link_initial_active_state() {
    const a_list = plain_get_query_selector('#MENU_DATA li a');
    const a_node = a_list[1].parentNode;
    window.ACTIVE_MENU = a_node;
    a_node.classList.add('active');
}

function clear_link_active_state(prev_element) {
    if (prev_element !== null) prev_element.classList.remove('active');
    return null;
}

function set_link_active_state(element, prev_element) {
    clear_link_active_state(prev_element);
    element = element.parentNode;
    element.classList.add('active');
    return element;
}

function get_folder_value(category, info, prefix, v) {
    const lang = window.RENDER_LANGUAGE;
    const id_data = window.ID_DATA[category];
    const h_name = prefix + 'D';
    // console.log(category, info, prefix, v);
    const h_id = info[v];
    const h_text = id_data[h_id][0];
    const f_text = id_data[h_id][1];
    info[h_name] = h_text;
    const f_name = prefix + 'N';
    if (lang !== 'English' && h_id === 0) {
        info[f_name] = '?';
    } else if (check_for_english_text(lang, category, h_id, f_text)) {
        info[f_name] = h_text;
    } else {
        info[f_name] = get_transliterator_text(lang, f_text);
    }
}

function get_match_count(f_category, f_value, context_list, c_len) {
    let found = 0;
    for (let c = 1; c < c_len; c++) {
        if (context_list[c][0] === f_category && context_list[c][2] === f_value) found += 1;
    }
    return found;
}

function translate_movie_id_to_data(category, sd, st, movie_list) {
    const HF = [ 'M', 'P' ];
    const HCATEGORY = [ 'movie', 'person' ];
    for (const [i, movie] of movie_list.entries()) {
        for (const v of HF) {
            get_folder_value(HCATEGORY[m], movie, v, v);
        }
        movie['I'] = i + 1;
    }
}

function translate_folder_id_to_data(category, id, data) {
    const ff = FF[category];
    const f_category = ff[0];
    const f_type = ff[1];
    const sd = ff[2];
    const st = ff[3];
    for (const video of data['videos']) {
        for (const folder of video['folder']) {
            const movie_list = folder['movies'];
            let movie_ids = (category !== 'movie') ? folder['M'] : '';
            folder['HT'] = f_category;
            folder['HC'] = movie_list.length;
            get_folder_value(f_category, folder, 'H', f_type);
            for (const movie of movie_list) {
                for (let m = 0; m < OF.length; m++) {
                    const c = OF[m] + 'T';
                    movie[c] = st[m];
                    get_folder_value(st[m], movie, OF[m], sd[m]);
                }
                if (category === 'movie') movie_ids = movie['M'];
                movie['PM'] = movie_ids;
                movie['PP'] = movie['P'];
                const imageId = movie['I'].split('&')[0];
                const path = IMAGE_MAP[movie['J']] ?? 'maxdefault.jpg';
                movie['Z'] = `${imageId}/${path}`;
            }
        }
    }
}

function render_data_template(category, id, data, context_list) {
    const lang = window.RENDER_LANGUAGE;
    if (category === '') {
        plain_set_html_text('PAGE_VIDEOS', '');
        plain_set_html_text('PAGE_LYRICS', '');
        plain_set_html_text('PAGE_REFS', '');
        return;
    }

    const template_name = 'page-videos-template'
    let ul_template = plain_get_html_text(template_name);
    if (lang !== 'English') {
        const map_info_data = get_map_data('MAP_INFO_DICT');
        const map_dict = map_info_data[lang];
        data['VideoName'] = map_dict['Videos'];
        data['ViewName'] = map_dict['Views'];
    } else {
        data['VideoName'] = 'Videos';
        data['ViewName'] = 'Views';
    }

    translate_folder_id_to_data(category, id, data);

    if (context_list !== undefined) {
        const c_len = context_list.length;
        for (const video of data['videos']) {
            const new_folder_list = [];
            for (const folder of video['folder']) {
                const f_category = folder['HT'];
                const f_value = folder['HN'];
                const s_found = get_match_count(f_category, f_value, context_list, c_len);
                const movie_list = folder['movies'];
                const new_movie_list = [];
                for (const movie of movie_list) {
                    let found = s_found;
                    for (let m = 0; m < OF.length; m++) {
                        let c = OF[m] + 'T';
                        let f_category = movie[c];
                        c = OF[m] + 'N';
                        let f_value = movie[c];
                        found += get_match_count(f_category, f_value, context_list, c_len);
                    }
                    if (found >= (c_len - 1)) new_movie_list.push(movie);
                }
                folder['movies'] = new_movie_list;
                if (new_movie_list.length > 0) new_folder_list.push(folder);
            }
            video['folder'] = new_folder_list;
        }
    }

    const template_html = Mustache.render(ul_template, data);
    plain_set_html_text(id, template_html);
}

function empty_content_data(category, name) {
    const lang = window.RENDER_LANGUAGE;
    const map_info_data = get_map_data('MAP_INFO_DICT');
    const map_dict = map_info_data[lang];
    plain_set_html_text('PAGE_TITLE', '');
    render_card_template('page-info-spinner', 'PAGE_INFO', { 'info' : { 'T' : map_dict['Fetch'] } });
    const empty_data = {};
    render_data_template('', '', empty_data);
    window.scrollTo(0, 0);
}

function render_content_data(category, name, video_data, context_list) {
    info_transliteration(category, video_data);
    render_card_template('page-title-template', 'PAGE_TITLE', video_data);
    setTimeout(function() {
        render_card_template('page-info-template', 'PAGE_INFO', video_data);
        render_data_template(category, 'PAGE_VIDEOS', video_data, context_list);
        render_card_template('page-lyrics-text-template', 'PAGE_LYRICS', video_data);
        render_card_template('page-lyrics-ref-template', 'PAGE_REFS', video_data);
        window.scrollTo(0, 0);
    }, 0);
}

function load_context_search_data(context_list) {
    const [ category, name ] = context_list[0].split(':');
    const new_context_list = [];
    for (const context of context_list) {
        new_context_list.push(context.split(':'));
    }
    load_content_data(category, name, undefined, new_context_list);
}

function normalize_search_text(search_text) {
    search_text = search_text.toLowerCase();
    search_text = search_text.replace(/(e)\1+/g, 'i');
    search_text = search_text.replace(/(o)\1+/g, 'u');
    search_text = search_text.replace(/(.)\1+/g, '$1');
    search_text = search_text.replace(/([bcdfgjklpst])h/g, '$1')
    search_text = search_text.replace(/([sd])v/g, '$1w')
    search_text = search_text.replace(/([ao])u/g, 'ow')
    return search_text;
}

function search_load_fetch_data(search_index_obj) {
    const search_engine = window.movie_search_engine;
    let data_id = 0;
    const search_obj = search_index_obj['Search'];
    for (let category in search_obj) {
        const data_list = search_obj[category];
        data_list.forEach(function (data_item, data_index) {
            const h_id = data_item.H;
            const aka_list = data_item.A.split(',');
            const data_doc = { 'id' : data_id, 'href' : h_id, 'title' : h_id, 'aka' : aka_list, 'category' : category, 'pop' : data_item.P };
            search_engine.add(data_doc);
            data_id += 1;
        });
    }
    window.MOVIE_CHAR_MAP = search_index_obj['Charmap'];
    transliterator_init();
}

function search_init() {
    window.movie_search_engine = new MiniSearch({
        fields: ['aka'], // fields to index for full-text search
        storeFields: ['title', 'href', 'category', 'pop'] // fields to return with search results
    });
    window.search_initialized = false;
    fetch_url_data('SEARCH DATA', 'search_index.json');
    window.search_initialized = true;
}

function get_search_results(search_word, search_options, item_list, id_list, base_pop) {
    const word_list = search_word.split(' ');
    const new_word_list = [];
    for (let word of word_list) {
        if (word !== '') {
            word = normalize_search_text(word);
            new_word_list.push(word.slice(0,8));
        }
        search_word = new_word_list.join(' ');
    }
    const lang = window.RENDER_LANGUAGE;
    const map_info_data = get_map_data('MAP_INFO_DICT');
    const map_dict = map_info_data[lang];
    const results = window.movie_search_engine.search(search_word, search_options);
    if (results.length <= 0) return;
    const max_score = results[0].score;
    for (const result_item of results) {
        if (id_list.has(result_item.id)) continue;
        let pop = result_item.pop;
        if (search_word.length > 2) {
            pop = ((400 * result_item.score) / max_score) + (0.6 * pop);
        }
        pop = base_pop + pop;
        const category = result_item.category
        const id_data = window.ID_DATA[category];
        const c_name = capitalize_word(category);
        const n_category = (lang === 'English') ? category.toUpperCase() : map_dict[c_name];
        const href = id_data[result_item.href][0];
        let title = id_data[result_item.title][1];
        if (check_for_english_text(lang, category, result_item.href, href)) {
            title = href;
        } else {
            title = get_transliterator_text(lang, title);
        }
        const item = { 'T' : category, 'C' : n_category, 'I' : MOVIE_ICON_DICT[category],
                       'H' : href, 'N' : title, 'P' : pop
                     };
        const need_poster = category === 'person';
        if (need_poster) {
            const poster_data = window.ABOUT_DATA[category];
            const image_name = poster_data[result_item.href]
            if (image_name !== undefined) {
                item['J'] = `Images/${image_name}.jpg`;
            }
        }
        item_list.push(item);
        id_list.add(result_item.id);
    }
}

function transliterator_init() {
    const char_map = window.MOVIE_CHAR_MAP;
    const key_list = [];
    let max_len = 0;
    for (let s in char_map) {
        key_list.push(s);
        max_len = Math.max(max_len, s.length);
    }
    window.CHAR_MAP_MAX_LENGTH = max_len;
    window.CHAR_MAP_KEY_LIST = new Set(key_list);

    set_tamil_regex_list();
}

function transliterate_text(word) {
    const char_map = window.MOVIE_CHAR_MAP;
    const tokenset = window.CHAR_MAP_KEY_LIST;
    const maxlen = window.CHAR_MAP_MAX_LENGTH;
    let current = 0;
    const tokenlist = [];
    word = word.toString();
    while (current < word.length) {
        const nextstr = word.slice(current, current+maxlen);
        let p = nextstr[0];
        let j = 1;
        let i = maxlen;
        while (i > 0) {
            let s = nextstr.slice(0, i);
            if (tokenset.has(s)) {
                p = s;
                j = i;
                break
            }
            i -= 1;
        }
        if (p in char_map) {
            p = char_map[p];
        }
        tokenlist.push(p);
        current += j;
    }
    let new_word = tokenlist.join('');
    if (word !== new_word) {
        new_word = new_word.replace(/_/g, '');
        new_word = new_word.replace(/G/g, 'n');
        new_word = new_word.replace(/J/g, 'n');
    }
    return new_word;
}

function get_tamil_phonetic_word(word) {
    const w_list = [];
    const new_word = word.toLowerCase();
    for (const c of new_word) {
        w_list.push((c in SEARCH_MAP_DICT) ? SEARCH_MAP_DICT[c] : c);
    }
    return w_list.join('');
}

function load_search_part(search_word, non_english) {
    const s_search_word = search_word.replace(/\s/g, '');
    const item_list = [];
    const id_list = new Set();
    let search_options = { prefix: true, combineWith: 'AND', fuzzy: term => term.length > 3 ? 0.1 : null };
    get_search_results(search_word, search_options, item_list, id_list, 4000);
    if (search_word !== s_search_word) {
        get_search_results(s_search_word, search_options, item_list, id_list, 1000);
    }
    let n_search_word = '';
    if (non_english) {
        n_search_word = get_tamil_phonetic_word(search_word);
        get_search_results(n_search_word, search_options, item_list, id_list, 5000);
    }
    if (search_word.length > 2) {
        let search_options = { prefix: true, combineWith: 'AND', fuzzy: term => term.length > 3 ? 0.3 : null };
        get_search_results(search_word, search_options, item_list, id_list, 0);
        if (non_english && n_search_word) {
            get_search_results(n_search_word, search_options, item_list, id_list, 0);
        }
        if (search_word !== s_search_word) {
            get_search_results(s_search_word, search_options, item_list, id_list, 0);
        }
    }
    item_list.sort(function (a, b) { return b.P - a.P; });
    const new_item_list = item_list.slice(0, 25);
    return new_item_list;
}

function handle_search_word(search_word) {
    const lang = window.RENDER_LANGUAGE;
    const c = search_word.charCodeAt(0);
    if (c > 127) search_word = transliterate_text(search_word);
    const non_english = (0x0B80 <= c && c <= 0x0BFF) ? true : false;
    const context_list = search_word.split(':');
    const context_dict = {};
    let new_item_list = [];
    for (const word of context_list) {
        new_item_list = load_search_part(word, non_english);
        context_dict[word] = new_item_list;
    }
    let result_header = 'Search Results';
    if (lang !== 'English') {
        const map_info_data = get_map_data('MAP_INFO_DICT');
        const map_dict = map_info_data[lang];
        result_header = map_dict[result_header];
    }
    const item_data = { 'title' : { 'N': result_header, 'I': 'search' }, 'items' : new_item_list };
    render_card_template('page-title-template', 'PAGE_TITLE', item_data);
    if (context_list.length <= 1) {
        render_card_template('page-search-template', 'PAGE_INFO', item_data);
    } else {
        const row_list = [];
        for (const [i, w] of context_list.entries()) {
            row_list.push({ 'I' : i, 'col' : context_dict[w] });
        }
        const row_data = { 'items' : row_list };
        render_card_template('page-context-search-template', 'PAGE_INFO', row_data);
    }
    render_data_template('', '', item_data);
    window.scrollTo(0, 0);
    add_history('search', { 'category' : window.NAV_CATEGORY, 'search' : search_word });
}

function load_search_data() {
    window.ACTIVE_NAV = clear_link_active_state(window.ACTIVE_NAV);
    let search_word = document.getElementById('SEARCH_WORD').value;
    search_word = decodeURI(search_word);
    handle_search_word(search_word);
}

function init_search_listener() {
    const element = document.getElementById('SEARCH_WORD');
    element.addEventListener('input', load_search_data);
}

function load_search_history(data) {
    const search_word = data['search'];
    document.getElementById('SEARCH_WORD').value = search_word;
    handle_search_word(search_word);
}

function handle_context_search() {
    const select_list = plain_get_query_selector('select[id^=COL_]');
    const cols = select_list.length;
    const context_list = [];
    for (const select_element of select_list) {
        const option = select_element.options[select_element.selectedIndex].value;
        if (option === '' || option === undefined) continue;
        const new_option = option.replace(/\s/g, '');
        if (new_option === '' || new_option === undefined) continue;
        context_list.push(option);
    }
    load_context_search_data(context_list);
}

function play_ended() {
    const note_list = window.note_play_list;
    const note_index = window.note_play_index;
    const swara = note_list[note_index];
    const note_data = get_map_data('NOTE_MAP');
    const note = note_data[swara];
    const key_div = 'note' + note;
    plain_set_background_color(key_div, window.note_key_color);
    window.note_play_index += 1;
    if (window.note_play_index < window.note_play_list.length) {
        play_note();
    }
};

function play_note() {
    const note_list = window.note_play_list;
    const note_index = window.note_play_index;
    const swara = note_list[note_index];
    const note_data = get_map_data('NOTE_MAP');
    const note = note_data[swara];
    const key_div = 'note' + note;
    window.note_key_color = plain_get_background_color(key_div);
    plain_set_background_color(key_div, 'cyan');
    const note_audio = document.getElementById('NOTE_PLAY');
    const src = 'audio/' + note + '.mp3';
    note_audio.src = src;
    note_audio.currentTime = 0;
    note_audio.onended = play_ended;
    note_audio.play();
}

function play_notes(notes) {
    window.note_play_list = notes.split(' ');
    window.note_play_index = 0;
    play_note();
}

function render_youtube_video_info(id, video_data) {
    const info_list = [];
    let title = id;
    for (let key in video_data) {
        if (VIDEO_INFO_KEY_LIST.has(key)) {
            const value = video_data[key];
            if (key === 'title') {
                title = value;
            } else {
                info_list.push({ 'N' : key, 'C' : value });
            }
        }
    }
    const video_id = id.split('&')[0];
    info_list.push({ 'N' : 'id', 'C' : video_id });
    const image = video_data['thumbnail_url'];
    const info_data = { 'videoinfo' : info_list, 'videoimage' : { 'I' : video_id, 'P' : image } };
    /*
    const chapter_data = window.CONCERT_DATA[video_id];
    if (chapter_data !== undefined) {
        const category = 'person';
        const ff = FF[category];
        const sd = ff[2];
        const st = ff[3];
        translate_movie_id_to_data(category, sd, st, chapter_data);
        info_data['chapters'] = { 'movies' : window.CONCERT_DATA[video_id] };
    }
    */
    render_modal_dialog(title, 'modal-videoinfo-template', info_data);
}

function get_youtube_video_info(id) {
    const url = `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`
    fetch_url_data('VIDEO INFO', url, [ id ]);
}

function load_nav_data(category, element) {
    if (category !== 'about') window.NAV_CATEGORY = category;
    if (element !== undefined && category !== 'about') {
        window.ACTIVE_MENU = set_link_active_state(element, window.ACTIVE_MENU);
    }
    const url = `${category}.json`;
    fetch_url_data('NAV DATA', url, [ category ]);
}

function load_content_data(category, name, element, new_context_list) {
    if (element !== undefined) {
        window.ACTIVE_NAV = set_link_active_state(element, window.ACTIVE_NAV);
    }
    window.CONTENT_CATGEGORY = category;
    window.CONTENT_NAME = name;
    empty_content_data(category, name);
    const url = `${category}/${name}.json`;
    fetch_url_data('CONTENT DATA', url, [ category, name, new_context_list ]);
}

function load_init_data(id_data, about_data, hk_data) {
    if (window.innerWidth < 992) {
        show_modal_dialog('Best Viewed in Landscape Mode', 'Use Landscape Mode');
    }
    window.ID_DATA = id_data;
    window.ABOUT_DATA = about_data;
    init_lang_maps(hk_data);
    load_nav_data('movie');
    if (window.default_movie !== '') load_content_data('movie', window.default_movie);
    search_init();
    // fetch_url_data('CONCERT DATA', 'concert.json');
}

async function fetch_url_data(name, url, args) {
    const url_data = await fetch_url(url);
    if (url_data === null) return null;
    if (name === 'NAV DATA') {
        const category = args[0];
        load_nav_fetch_data(category, url_data);
    } else if (name === 'CONTENT DATA') {
        const [ category, h_name, new_context_list ] = args;
        render_content_data(category, h_name, url_data, new_context_list);
        if (new_context_list === undefined) {
            add_history('content', { 'category' : category, 'name' : h_name });
        }
    } else if (name === 'SEARCH DATA') {
        search_load_fetch_data(url_data);
    } else if (name === 'VIDEO INFO') {
        const id = args[0];
        render_youtube_video_info(id, url_data);
    } else if (name === 'CONCERT DATA') {
        window.CONCERT_DATA = url_data;
    }
    return url_data;
}

/*
    Speech To Text
*/

function speech_to_text_init() {
    window.speech_recognizing = false;
    window.speech_final_transcript = '';
    window.speech_recognizing = false;
    window.speech_ignore_onend;
    window.speech_start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
        console.log('Speech not working:');
    } else {
        window.speech_recognition = new webkitSpeechRecognition();
        window.speech_recognition.continuous = true;
        window.speech_recognition.interimResults = true;

        window.speech_recognition.onstart = function() {
            window.speech_recognizing = true;
            console.log('Speech Starting:');
        };

        window.speech_recognition.onerror = function(event) {
            if (event.error === 'no-speech') {
                console.log('Speech Error: No Speech');
                window.speech_ignore_onend = true;
            }
            if (event.error === 'audio-capture') {
                console.log('Speech Error: Audio Capture');
              window.speech_ignore_onend = true;
            }
            if (event.error === 'not-allowed') {
                if (event.timeStamp - window.speech_start_timestamp < 100) {
                    console.log('Speech Error: Info Blocked');
                } else {
                    console.log('Speech Error: Info Denied');
                }
                window.speech_ignore_onend = true;
            }
        };

        window.speech_recognition.onend = function() {
            window.speech_recognizing = false;
            if (window.speech_ignore_onend) {
                console.log('Speech Error: Ignore End');
                return;
            }
            if (!window.speech_final_transcript) {
                console.log('Speech End:');
                return;
            }
        };

        window.speech_recognition.onresult = function(event) {
            let interim_transcript = '';
            /*
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    window.speech_final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
                console.log('Speech Interim: ' + event.resultIndex + ' ' + event.results.length + ' ' + event.results[i][0].transcript);
            }
            console.log('Speech Result: ' + event.resultIndex + ' ' + event.results.length + ' ' + interim_transcript);
            */
            if (event.results.length > 0) {
                window.speech_final_transcript = event.results[0][0].transcript;
            } else {
                window.speech_final_transcript = '';
            }
            if (window.speech_final_transcript || interim_transcript) {
                window.speech_recognition.stop();
                toggle_icon('MIC_IMAGE', 'mic', 'mic-mute');
                document.getElementById('SEARCH_WORD').value = window.speech_final_transcript;
                // console.log('Speech Final: ' + window.speech_final_transcript);
                load_search_data();
            }
        };
    }
}

function speech_start(event) {
    if (!('webkitSpeechRecognition' in window)) return;
    if (window.speech_recognizing) {
        window.speech_recognition.stop();
        return;
    }
    const map_iso_data = get_map_data('MAP_ISO_DICT');
    const lang = window.RENDER_LANGUAGE;
    window.speech_final_transcript = '';
    window.speech_recognition.lang = map_iso_data[lang];
    window.speech_recognition.start();
    window.speech_ignore_onend = false;
    window.speech_start_timestamp = event.timeStamp;
    toggle_icon('MIC_IMAGE', 'mic-mute', 'mic');
}

function load_keyboard(event) {
    const lang = window.RENDER_LANGUAGE;
    set_input_keyboard(lang.toLowerCase());
    get_bs_modal('LANG_KBD').show();
}

function handle_history_context(data) {
    const context = data['context'];
    if (context === 'content') {
        load_content_data(data['category'], data['name']);
    } else if (context === 'nav') {
        load_nav_data(data['category']);
    } else if (context === 'search') {
        load_search_history(data);
    }
}

function handle_popstate(e) {
    const data = e.state;
    if (data === null || data === undefined) return;
    // console.log('POP: ', e);
    window.movie_popstate = true;
    handle_history_context(data);
    const lang = data['language'];
    // set_language({ 'value' : lang });
}

function add_history(context, data) {
    // const url = window.collection_name + '.html';
    const url = 'movie.html';
    // if (context === 'nav') return;
    data['language'] = window.GOT_LANGUAGE;
    if (!window.movie_popstate) {
        data['context'] = context;
        let title = 'Tamil: ' + capitalize_word(data['category']);
        const name = data['name'];
        if (name !== undefined) title += ' ' + name;
        // console.log('PUSH: ', data, window.movie_popstate);
        history.pushState(data, title, url);
    }
    window.history_data = data;
    window.movie_popstate = false;
}

function load_youtube_frame() {
    const value = plain_get_attr('FRAME_PLAYER', 'data-src');
    plain_set_attr('FRAME_PLAYER', 'src', value);
    youtube_player_init();
}

function collection_init(collection, default_movie) {
    const lang = 'Tamil';
    window.collection_name = collection;
    window.default_movie = default_movie;

    const elements = document.getElementsByTagName('html');
    window.COLOR_SCHEME = elements[0].getAttribute('data-bs-theme');
    window.RENDER_LANGUAGE = lang;
    window.GOT_LANGUAGE = 'தமிழ்';
    set_tamil_regex_list();

    window.history_data = undefined;
    window.movie_popstate = false;

    window.NAV_SCROLL_SPY = null;
    window.ACTIVE_MENU = null;
    window.ACTIVE_NAV = null;

    sessionStorage.clear();
    window.addEventListener('storage', on_storage_event, false);
    window.addEventListener('popstate', handle_popstate);

    document.addEventListener('DOMContentLoaded', function() {
        if (document.readyState === "interactive" || document.readyState === "complete" ) {
            setTimeout(load_youtube_frame, 0);
        }
    });

    const url_list = [ fetch_url_data('ID DATA', 'id.json'),
                       fetch_url_data('ABOUT DATA', 'about.json'),
                       fetch_url_data('LANG DATA', 'hk_lang_map.json')
                     ];
    Promise.all(url_list).then((values) => {
        const [ id_data, about_data, hk_data ] = values;
        load_init_data(id_data, about_data, hk_data);
        load_menu_data(lang);
    });

    init_input_keyboard();
}

