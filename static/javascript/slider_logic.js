// logic for page table on synxroform/index page. 
// copyright synxroform:__zaika_denis 2019.


function trim_prop(prop, unit) {
    let idx = prop.indexOf(unit);
    return prop.substring(0, idx);
}


function choose(list) {
    return list[Math.floor(Math.random() * list.length)];
}

let postlist = document.getElementById("postlist");

//..........................................................................

let slider = document.getElementById("slider");
let thumb  = document.getElementById("thumb");
let maxima = 0;


function update_grid(parameter) {
    postlist.style.left = -(parameter * (maxima - postlist.offsetWidth)) + "px";
}


function thumb_mousemove(down_event) {
    let origin = Number(trim_prop(thumb.style.left, "px"));
    let move = (move_event) => {
        if (move_event.buttons == 0) {
            window.removeEventListener("mousemove", move);
        }
        let dx = down_event.pageX - move_event.pageX;
        let rs = slider.getBoundingClientRect();
        let rt = thumb.getBoundingClientRect();
        let up = rs.width - rt.width;
        thumb.style.left = Math.min(Math.max(0, origin - dx), up) + "px";
        update_grid((rt.left - rs.left) / up);
    }
    down_event.preventDefault();
    return move
}


function thumb_mousedown(down_event) {
    window.addEventListener("mousemove", thumb_mousemove(down_event));
}

thumb.addEventListener("mousedown", thumb_mousedown);


//..........................................................................

let page_out  = document.getElementById("page_id_lookout");
let page_info = document.getElementById("page_info");

let a_out = page_out.firstElementChild
let b_out = page_out.lastElementChild;

function animate_id(time, counter, text, prev_time) {
    if (prev_time != null) {
        counter += (time - prev_time) * 0.2;
        page_out.style.top = -counter + "px";
    }
    if (counter > 10) {
        b_out.innerText = text;
    }
    if (counter < 22) {
        requestAnimationFrame(new_time => animate_id(new_time, counter, text, time));
    }
}

function cell_mouseover(post_data) {
    let id   = post_data.getAttribute("postid");
    let desc = post_data.getAttribute("postdesc");
    let callback = () => {
        a_out.innerText = b_out.innerText
        
        let txt = id == "A." ? "A.00" : id;
        requestAnimationFrame(t => animate_id(t, 0, txt))
        page_info.firstElementChild.innerText = desc;
    }
    return callback;
}


let page_table = [] // table for page filters

function generate_table(num_rows, num_cols, blk_width, kerning) {
    
    let ct = document.getElementById("cell_template");
    let post_md = document.getElementsByName("post_md");

    for (let n = 0; n < num_rows; n += 1) {
        let offset = (n % 2) * 100;
        for (let k = 0; k < num_cols; k += 1) {
            
            let block = document.createElement("div");
            let index = k * num_rows + n;
            let clamp = index < post_md.length - 1 ? index + 1 : 0;
            let post  = post_md[clamp];

            block.innerHTML   = ct.innerHTML;
            block.className   = choose(["r_cell", "l_cell"])
            block.style.width = blk_width + "px";
            block.style.left  = offset + "px";
            block.style.top   = n * kerning  + "px";
            
            
            link = block.firstElementChild;
            link.setAttribute("href", post.getAttribute("link"))

            link.firstElementChild.innerText = post.getAttribute("postid").split(".")[1];
            block.addEventListener("mouseover", cell_mouseover(post));

            postlist.appendChild(block);
            if (clamp != 0) {
                page_table.push([post, block]);
            }
            
            offset += blk_width + 30;
            if (offset + blk_width > maxima) {
                maxima = offset + blk_width;
            }
        }
    }
}

generate_table(3, 10, 150, 30);