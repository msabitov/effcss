import { comma, dash, space } from './functions';

const X = 'x';
const Y = 'y';
const STATIC = 'static';
const UP = 'up';
const DOWN = 'down';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const TEXT = 'text';
const FONT = 'font';
const COLUMN = 'column';
const MAX = 'max';
const MIN = 'min';
const CONTENT = 'content';
const CONTENTS = CONTENT + 's';
const ITEMS = 'items';
const SELF = 'self';
const DISPLAY = 'display';
const INLINE = 'inline';
const BLOCK = 'block';
const SIZE = 'size';
const RADIUS = 'radius';
const DIRECTION = 'direction';
const OUTLINE = 'outline';
const STYLE = 'style';
const BALANCE = 'balance';
const END = 'end';
const START = 'start';
const CENTER = 'center';
const DECORATION = 'decoration';
const WORD = 'word';
const LINE = 'line';
const BREAK = 'break';
const WRAP = 'wrap';
const NOWRAP = 'nowarp';
const TEMPLATE = 'template';
const RULE = 'rule';
const COUNT = 'count';
const OBJECT = 'object';
const FIT = 'fit';
const TOP = 'top';
const LEFT = 'left';
const BOTTOM = 'bottom';
const RIGHT = 'right';
const WIDTH = 'width';
const COLOR = 'color';
const OVERFLOW = 'overflow';
const ALIGN = 'align';
const STOP = 'stop';
const TYPE = 'type';
const TRANSFORM = 'transform';
const ALL = 'all';
const HEIGHT = 'height';
const NORMAL = 'normal';
const ALWAYS = 'always';
const OPACITY = 'opacity';
const SOLID = 'solid';
const DOTTED = 'dotted';
const DASHED = 'dashed';
const DOUBLE = 'double';
const OUTSET = 'outset';
const RIDGE = 'ridge';
const GROOVE = 'groove';
const VISIBILITY = 'visibility';
const SCALE = 'scale';
const BOX = 'box';
const BORDER = 'border';
const POSITION = 'position';
const SPAN = 'span';
const NONE = 'none';
const AUTO = 'auto';
const SMOOTH = 'smooth';
const FILL = 'fill';
const STROKE = 'stroke';
const REVERSE = 'reverse';
const SPACE = 'space';
const INHERIT = 'inherit';
const INFINITE = 'infinite';
const ABSOLUTE = 'absolute';
const FIXED = 'fixed';
const RELATIVE = 'relative';
const LIST_STYLE = 'list-style';
const Z_INDEX = 'z-index';
const ORIGIN = 'origin';
const BRAND = 'brand';
const HUE = 'hue';
const LIGHTNESS = 'lightness';
const ALPHA = 'alpha';
const LUMINANCE = 'luminance';
const MATCH_SOURCE = 'match-source';
const CLIP = 'clip';
const ZOOM = 'zoom';
const SCROLL = 'scroll';
const LOCAL = 'local';
const PADDING = 'padding';
const MARGIN = 'margin';
const BOTH = 'both';
const MODE = 'mode';
const REPEAT = 'repeat';
const VIEW = 'view';
const ADD = 'add';
const SUBTRACT = 'subtract';
const INTERSECT = 'intersect';
const EXCLUDE = 'exclude';
const NO = 'no';
const DARK = 'dark';
const LIGHT = 'light';
const IN = 'in';
const OUT = 'out';
const LINEAR = 'linear';
const EMPTY_STRING = '""';
const CURRENT_COLOR = 'currentColor';
const OFFSET = 'offset';
const HIDDEN = 'hidden';
const MANUAL = 'manual';
const VISIBLE = 'visible';
const CONTAIN = 'contain';
const COVER = 'cover';
const SHADOW = 'shadow';
const COLLAPSE = 'collapse';

// values
const BORDER_BOTTOM = dash(BORDER, BOTTOM);
const BORDER_LEFT = dash(BORDER, LEFT);
const BORDER_RIGHT = dash(BORDER, RIGHT);
const BORDER_TOP = dash(BORDER, TOP);
const BORDER_BLOCK = dash(BORDER, BLOCK);
const BORDER_INLINE = dash(BORDER, INLINE);
const BORDER_BLOCK_START = dash(BORDER_BLOCK, START);
const BORDER_BLOCK_END = dash(BORDER_BLOCK, END);
const BORDER_INLINE_START = dash(BORDER_INLINE, START);
const BORDER_INLINE_END = dash(BORDER_INLINE, END);
// border-width
const BORDER_WIDTH = dash(BORDER, WIDTH);
const BORDER_BOTTOM_WIDTH = dash(BORDER_BOTTOM, WIDTH);
const BORDER_LEFT_WIDTH = dash(BORDER_LEFT, WIDTH);
const BORDER_RIGHT_WIDTH = dash(BORDER_RIGHT, WIDTH);
const BORDER_TOP_WIDTH = dash(BORDER_TOP, WIDTH);
const BORDER_BLOCK_WIDTH = dash(BORDER_BLOCK, WIDTH);
const BORDER_INLINE_WIDTH = dash(BORDER_INLINE, WIDTH);
const BORDER_BLOCK_START_WIDTH = dash(BORDER_BLOCK_START, WIDTH);
const BORDER_BLOCK_END_WIDTH = dash(BORDER_BLOCK_END, WIDTH);
const BORDER_INLINE_START_WIDTH = dash(BORDER_INLINE_START, WIDTH);
const BORDER_INLINE_END_WIDTH = dash(BORDER_INLINE_END, WIDTH);
// border-radius
const BORDER_RADIUS = dash(BORDER, RADIUS);
const BORDER_BOTTOM_LEFT_RADIUS = dash(BORDER, BOTTOM, LEFT, RADIUS);
const BORDER_BOTTOM_RIGHT_RADIUS = dash(BORDER, BOTTOM, RIGHT, RADIUS);
const BORDER_TOP_LEFT_RADIUS = dash(BORDER, TOP, LEFT, RADIUS);
const BORDER_TOP_RIGHT_RADIUS = dash(BORDER, TOP, RIGHT, RADIUS);
const BORDER_START_END_RADIUS = dash(BORDER, START, END, RADIUS);
const BORDER_START_START_RADIUS = dash(BORDER, START, START, RADIUS);
const BORDER_END_END_RADIUS = dash(BORDER, END, END, RADIUS);
const BORDER_END_START_RADIUS = dash(BORDER, END, START, RADIUS);
// border-color
const BORDER_COLOR = dash(BORDER, COLOR);
const BORDER_LEFT_COLOR = dash(BORDER_LEFT, COLOR);
const BORDER_RIGHT_COLOR = dash(BORDER_RIGHT, COLOR);
const BORDER_TOP_COLOR = dash(BORDER_TOP, COLOR);
const BORDER_BOTTOM_COLOR = dash(BORDER_BOTTOM, COLOR);
const BORDER_BLOCK_COLOR = dash(BORDER_BLOCK, COLOR);
const BORDER_INLINE_COLOR = dash(BORDER_INLINE, COLOR);
const BORDER_BLOCK_START_COLOR = dash(BORDER_BLOCK_START, COLOR);
const BORDER_BLOCK_END_COLOR = dash(BORDER_BLOCK_END, COLOR);
const BORDER_INLINE_START_COLOR = dash(BORDER_INLINE_START, COLOR);
const BORDER_INLINE_END_COLOR = dash(BORDER_INLINE_END, COLOR);
// border-style
const BORDER_STYLE = dash(BORDER, STYLE);
const BORDER_LEFT_STYLE = dash(BORDER_LEFT, STYLE);
const BORDER_RIGHT_STYLE = dash(BORDER_RIGHT, STYLE);
const BORDER_TOP_STYLE = dash(BORDER_TOP, STYLE);
const BORDER_BOTTOM_STYLE = dash(BORDER_BOTTOM, STYLE);
const BORDER_BLOCK_STYLE = dash(BORDER_BLOCK, STYLE);
const BORDER_INLINE_STYLE = dash(BORDER_INLINE, STYLE);
const BORDER_BLOCK_START_STYLE = dash(BORDER_BLOCK_START, STYLE);
const BORDER_BLOCK_END_STYLE = dash(BORDER_BLOCK_END, STYLE);
const BORDER_INLINE_START_STYLE = dash(BORDER_INLINE_START, STYLE);
const BORDER_INLINE_END_STYLE = dash(BORDER_INLINE_END, STYLE);
// outline
const OUTLINE_COLOR = dash(OUTLINE, COLOR);
const OUTLINE_WIDTH = dash(OUTLINE, WIDTH);
const OUTLINE_STYLE = dash(OUTLINE, STYLE);
const OUTLINE_OFFSET = dash(OUTLINE, OFFSET);

const OVERFLOW_X = dash(OVERFLOW, X);
const OVERFLOW_Y = dash(OVERFLOW, Y);
const OBJECT_FIT = dash(OBJECT, FIT);
const OBJECT_POSITION = dash(OBJECT, POSITION);
const SCALE_DOWN = dash(SCALE, 'down');

const BOX_SHADOW = dash(BOX, SHADOW);

const PADDING_BOX = dash(PADDING, BOX);
const BORDER_BOX = dash(BORDER, BOX);
const CONTENT_BOX = dash(CONTENT, BOX);
const FILL_BOX = dash(FILL, BOX);
const STROKE_BOX = dash(STROKE, BOX);
const VIEW_BOX = dash(VIEW, BOX);
const NO_CLIP = dash(NO, CLIP);
const REPEAT_X = dash(REPEAT, X);
const REPEAT_Y = dash(REPEAT, Y);
const NO_REPEAT = dash(NO, REPEAT);
const PADDING_LEFT = dash(PADDING, LEFT);
const PADDING_TOP = dash(PADDING, TOP);
const PADDING_RIGHT = dash(PADDING, RIGHT);
const PADDING_BOTTOM = dash(PADDING, BOTTOM);

const MARGIN_LEFT = dash(MARGIN, LEFT);
const MARGIN_TOP = dash(MARGIN, TOP);
const MARGIN_RIGHT = dash(MARGIN, RIGHT);
const MARGIN_BOTTOM = dash(MARGIN, BOTTOM);

// layout
const GRID = 'grid';
const ROW = 'row';
const GAP = 'gap';
const JUSTIFY = 'justify';
const FLEX = 'flex';
const ORDER = 'order';
const BASIS = 'basis';
const GROW = 'grow';
const SHRINK = 'shrink';
const INLINE_FLEX = dash(INLINE, FLEX);
const FLEX_BASIS = dash(FLEX, BASIS);
const FLEX_GROW = dash(FLEX, GROW);
const FLEX_SHRINK = dash(FLEX, SHRINK);
const FLEX_DIRECTION = dash(FLEX, DIRECTION);
const FLEX_WRAP = dash(FLEX, WRAP);
const JUSTIFY_CONTENT = dash(JUSTIFY, CONTENT);
const JUSTFY_ITEMS = dash(JUSTIFY, ITEMS);
const ALIGN_ITEMS = dash(ALIGN, ITEMS);
const ALIGN_CONTENT = dash(ALIGN, CONTENT);
const ALIGN_SELF = dash(ALIGN, SELF);
const GRID_TEMPLATE_ROWS = dash(GRID, TEMPLATE, ROW + 's');
const GRID_TEMPLATE_COLUMNS = dash(GRID, TEMPLATE, COLUMN + 's');
const ROW_GAP = dash(ROW, GAP);
const COLUMN_GAP = dash(COLUMN, GAP);
const JUSTFY_SELF = dash(JUSTIFY, SELF);
const GRID_ROW_END = dash(GRID, ROW, END);
const GRID_ROW_START = dash(GRID, ROW, START);
const GRID_COLUMN_END = dash(GRID, COLUMN, END);
const GRID_COLUMN_START = dash(GRID, COLUMN, START);
const COLUMN_COUNT = dash(COLUMN, COUNT);
const COLUMN_FILL = dash(COLUMN, FILL);
const COLUMN_RULE_COLOR = dash(COLUMN, RULE, COLOR);
const COLUMN_RULE_STYLE = dash(COLUMN, RULE, STYLE);
const COLUMN_RULE_WIDTH = dash(COLUMN, RULE, WIDTH);
const COLUMN_SPAN = dash(COLUMN, SPAN);
const COLUMN_WIDTH = dash(COLUMN, WIDTH);
const ROW_REVERSE = dash(ROW, REVERSE);
const COLUMN_REVERSE = dash(COLUMN, REVERSE);
const WRAP_REVERSE = dash(WRAP, REVERSE);
const FLEX_END = dash(FLEX, END);
const FLEX_START = dash(FLEX, START);
const SPACE_BETWEEN = dash(SPACE, 'between');
const SPACE_AROUND = dash(SPACE, 'around');
const SPACE_EVENLY = dash(SPACE, 'evenly');
const STRETCH = 'stretch';
const BASELINE = 'baseline';
const INLINE_GRID = dash(INLINE, GRID);
const MASK = 'mask';
const COMPOSITE = 'composite';
const MASK_CLIP = dash(MASK, CLIP);
const MASK_COMPOSITE = dash(MASK, COMPOSITE);
const MASK_MODE = dash(MASK, MODE);
const MASK_ORIGIN = dash(MASK, ORIGIN);
const MASK_POSITION = dash(MASK, POSITION);
const MASK_REPEAT = dash(MASK, REPEAT);
const MASK_SIZE = dash(MASK, SIZE);
const MASK_TYPE = dash(MASK, TYPE);

// values
const TIMING_FUNCTION = 'timing-function';
const ITERATION_COUNT = 'iteration-count';
const DELAY = 'delay';
const DURATION = 'duration';
const ANIMATION = 'animation';
const ANIMATION_NAME = dash(ANIMATION, 'name');
const ANIMATION_TIMING_FUNCTION = dash(ANIMATION, TIMING_FUNCTION);
const ANIMATION_DIRECTION = dash(ANIMATION, DIRECTION);
const ANIMATION_ITERATION_COUNT = dash(ANIMATION, ITERATION_COUNT);
const ANIMATION_DURATION = dash(ANIMATION, DURATION);
const ANIMATION_DELAY = dash(ANIMATION, DELAY);
const ANIMATION_PLAY_STATE = ANIMATION + '-play-state';
const ANIMATION_FILL_MODE = dash(ANIMATION, FILL, MODE);
const TRANSITION = 'transition';
const TRANSITION_BEHAVIOR = TRANSITION + '-behavior';
const TRANSITION_PROPERTY = TRANSITION + '-property';
const TRANSITION_TIMING_FUNCTION = dash(TRANSITION, TIMING_FUNCTION);
const TRANSITION_DURATION = dash(TRANSITION, DURATION);
const TRANSITION_DELAY = dash(TRANSITION, DELAY);

const RUNNING = 'running';
const PAUSED = 'paused';
const FORWARDS = 'forwards';
const BACKWARDS = 'backwards';
const ALTERNATE = 'alternate';
const ALTERNATE_REVERSE = dash(ALTERNATE, REVERSE);
const ALLOW_DISCRETE = 'allow-discrete';

const DASH_OUT = '-out';
const EASE = 'ease';
const EASE_IN = EASE + '-in';
const EASE_IN_OUT = EASE_IN + DASH_OUT;
const EASE_OUT = EASE + DASH_OUT;
const STEP = 'step';
const STEP_START = dash(STEP, START);
const STEP_END = dash(STEP, END);

const TRANSLATE = 'translate';
const ROTATE = 'rotate';
const SKEW = 'skew';
const PERSPECTIVE = 'perspective';
const PERSPECTIVE_ORIGIN = dash(PERSPECTIVE, ORIGIN);
const LEFT_TOP = space(LEFT, TOP);
const RIGHT_TOP = space(RIGHT, TOP);
const LEFT_BOTTOM = space(LEFT, BOTTOM);
const RIGHT_BOTTOM = space(RIGHT, BOTTOM);
const INSET = 'inset';
const TRANSFORM_BOX = dash(TRANSFORM, BOX);
const TRANSFORM_ORIGIN = dash(TRANSFORM, ORIGIN);
const TRANSFORM_STYLE = dash(TRANSFORM, STYLE);
const INSET_BLOCK = dash(INSET, BLOCK);
const INSET_BLOCK_END = dash(INSET, BLOCK, END);
const INSET_BLOCK_START = dash(INSET, BLOCK, START);
const INSET_INLINE = dash(INSET, INLINE);
const INSET_INLINE_END = dash(INSET, INLINE, END);
const INSET_INLINE_START = dash(INSET, INLINE, START);
const FIT_CONTENT = dash(FIT, CONTENT);
const MIN_CONTENT = dash(MIN, CONTENT);
const MAX_CONTENT = dash(MAX, CONTENT);
const ASPECT_RATIO = 'aspect-ratio';
const BOX_SIZING = dash(BOX, 'sizing');

const MAX_WIDTH = dash(MAX, WIDTH);
const MIN_WIDTH = dash(MIN, WIDTH);

const MAX_HEIGHT = dash(MAX, HEIGHT);
const MIN_HEIGHT = dash(MIN, HEIGHT);

const BLOCK_SIZE = dash(BLOCK, SIZE);
const MAX_BLOCK_SIZE = dash(MAX, BLOCK_SIZE);
const MIN_BLOCK_SIZE = dash(MIN, BLOCK_SIZE);

const INLINE_SIZE = dash(INLINE, SIZE);
const MAX_INLINE_SIZE = dash(MAX, INLINE_SIZE);
const MIN_INLINE_SIZE = dash(MIN, INLINE_SIZE);

const BEHAVIOR = 'behavior';
const SNAP = 'snap';

const SCROLL_BEHAVIOR = dash(SCROLL, BEHAVIOR);
const SCROLL_MARGIN = dash(SCROLL, MARGIN);
const SCROLL_MARGIN_TOP = dash(SCROLL, MARGIN, TOP);
const SCROLL_MARGIN_BOTTOM = dash(SCROLL, MARGIN, BOTTOM);
const SCROLL_MARGIN_LEFT = dash(SCROLL, MARGIN, LEFT);
const SCROLL_MARGIN_RIGHT = dash(SCROLL, MARGIN, RIGHT);

const SCROLL_MARGIN_BLOCK = dash(SCROLL, MARGIN, BLOCK);
const SCROLL_MARGIN_BLOCK_END = dash(SCROLL, MARGIN, BLOCK, END);
const SCROLL_MARGIN_BLOCK_START = dash(SCROLL, MARGIN, BLOCK, START);
const SCROLL_MARGIN_INLINE = dash(SCROLL, MARGIN, INLINE);
const SCROLL_MARGIN_INLINE_END = dash(SCROLL, MARGIN, INLINE, END);
const SCROLL_MARGIN_INLINE_START = dash(SCROLL, MARGIN, INLINE, START);

const SCROLL_PADDING = dash(SCROLL, PADDING);
const SCROLL_PADDING_TOP = dash(SCROLL, PADDING, TOP);
const SCROLL_PADDING_BOTTOM = dash(SCROLL, PADDING, BOTTOM);
const SCROLL_PADDING_LEFT = dash(SCROLL, PADDING, LEFT);
const SCROLL_PADDING_RIGHT = dash(SCROLL, PADDING, RIGHT);

const SCROLL_PADDING_BLOCK = dash(SCROLL, PADDING, BLOCK);
const SCROLL_PADDING_BLOCK_END = dash(SCROLL, PADDING, BLOCK, END);
const SCROLL_PADDING_BLOCK_START = dash(SCROLL, PADDING, BLOCK, START);
const SCROLL_PADDING_INLINE = dash(SCROLL, PADDING, INLINE);
const SCROLL_PADDING_INLINE_END = dash(SCROLL, PADDING, INLINE, END);
const SCROLL_PADDING_INLINE_START = dash(SCROLL, PADDING, INLINE, START);

const SCROLL_SNAP_ALIGN = dash(SCROLL, SNAP, ALIGN);
const SCROLL_SNAP_STOP = dash(SCROLL, SNAP, STOP);
const SCROLL_SNAP_TYPE = dash(SCROLL, SNAP, TYPE);
const MANDATORY = 'mandatory';
const X_MANDATORY = space(X, MANDATORY);
const Y_MANDATORY = space(Y, MANDATORY);
const BLOCK_MANDATORY = space(BLOCK, MANDATORY);
const INLINE_MANDATORY = space(INLINE, MANDATORY);
const BOTH_MANDATORY = space(BOTH, MANDATORY);
const PROXIMITY = 'proximity';
const X_PROXIMITY = space(X, PROXIMITY);
const Y_PROXIMITY = space(Y, PROXIMITY);
const BLOCK_PROXIMITY = space(BLOCK, PROXIMITY);
const INLINE_PROXIMITY = space(INLINE, PROXIMITY);
const BOTH_PROXIMITY = space(BOTH, PROXIMITY);
const TEXT_DECORATION = dash(TEXT, DECORATION);
const TEXT_DECORATION_COLOR = dash(TEXT_DECORATION, COLOR);
const WHITE_SPACE = 'white-space';
const TEXT_TRANSFORM = dash(TEXT, TRANSFORM);
const TEXT_ALIGN = dash(TEXT, ALIGN);
const TEXT_OVERFLOW = dash(TEXT, OVERFLOW);
const TEXT_ORIENTATION = dash(TEXT, 'orientation');
const WORD_BREAK = dash(WORD, BREAK);

const FONT_SIZE = dash(FONT, SIZE);
const FONT_WEIGHT = FONT + '-weight';
const FONT_FAMILY = FONT + '-family';
const FONT_STYLE = dash(FONT, STYLE);
const WRITING_MODE = dash('writing', MODE);
const HYPHENS = 'hyphens';
const LINE_HEIGHT = dash(LINE, HEIGHT);
const LINE_BREAK = dash(LINE, BREAK);
const LETTER_SPACING = 'letter-spacing';

const ANYWHERE = 'anywhere';
const LOOSE = 'loose';
const STRICT = 'strict';
const ITALIC = 'italic';
const OBLIQUE = 'oblique';
const BOLD = 'bold';
const LIGHTER = LIGHT + 'er';
const BOLDER = BOLD + 'er';
const LOWERCASE = 'lowercase';
const UPPERCASE = 'uppercase';
const CAPITALIZE = 'capitalize';
const LINE_THROUGH = LINE + '-through';
const OVERLINE = 'over' + LINE;
const UNDERLINE = 'under' + LINE;
const ELLIPSIS = 'ellipsis';
const PRE = 'pre';
const PRE_LINE = dash(PRE, LINE);
const PRE_WRAP = dash(PRE, WRAP);
const BREAK_SPACES = BREAK + '-spaces';
const BREAK_ALL = dash(BREAK, ALL);
const BREAK_WORD = dash(BREAK, WORD);
const HORIZONTAL_TB = HORIZONTAL + '-tb';
const VERTICAL_LR = VERTICAL + '-lr';
const VERTICAL_RL = VERTICAL + '-rl';
const KEEP_ALL = 'keep-' + ALL;
const POINTER = 'pointer';
const PAN = 'pan';
const PAN_X = dash(PAN, X);
const PAN_LEFT = dash(PAN, LEFT);
const PAN_RIGHT = dash(PAN, RIGHT);
const PAN_Y = dash(PAN, Y);
const PAN_UP = dash(PAN, UP);
const PAN_DOWN = dash(PAN, DOWN);
const PINCH_ZOOM = dash('pinch', ZOOM);
const MANIPULATION = 'manipulation';
const CROSSHAIR = 'crosshair';
const HELP = 'help';
const CURSOR = 'cursor';
const TOUCH_ACTION = 'touch-action';
const USER_SELECT = 'user-select';
const WILL_CHANGE = 'will-change';
const APPEARANCE = 'appearance';
const CONTEXT_MENU = 'context-menu';
const PROGRESS = 'progress';
const WAIT = 'wait';
const CELL = 'cell';
const COPY = 'copy';
const VERTICAL_TEXT = dash(VERTICAL, TEXT);
const GRAB = 'grab';
const GRABBING = GRAB + 'bing';
const RESIZE = 'resize';
const MOVE = 'move';
const COL_RESIZE = 'col-' + RESIZE;
const ROW_RESIZE = 'row-' + RESIZE;
const N_RESIZE = 'n-' + RESIZE;
const E_RESIZE = 'e-' + RESIZE;
const S_RESIZE = 's-' + RESIZE;
const W_RESIZE = 'w-' + RESIZE;
const NE_RESIZE = 'ne-' + RESIZE;
const EW_RESIZE = 'ew-' + RESIZE;
const NW_RESIZE = 'nw-' + RESIZE;
const SE_RESIZE = 'se-' + RESIZE;
const SW_RESIZE = 'sw-' + RESIZE;
const NS_RESIZE = 'ns-' + RESIZE;
const NESW_RESIZE = 'nesw-' + RESIZE;
const NWSE_RESIZE = 'nwse-' + RESIZE;
const ZOOM_IN = dash(ZOOM, IN);
const ZOOM_OUT = dash(ZOOM, OUT);
const POINTER_EVENTS = dash(POINTER, 'events');
const SCROLL_POSITION = dash(SCROLL, POSITION);
const CARET_COLOR = dash('caret', COLOR);
const ACCENT_COLOR = dash('accent', COLOR);
const FILTER = 'filter';
const BACKDROP_FILTER = 'backdrop-' + FILTER;
const TRANSPARENT = 'transparent';
const BACKGROUND = 'background';
const BACKGROUND_COLOR = dash(BACKGROUND, COLOR);
const BACKGROUND_CLIP = dash(BACKGROUND, CLIP);
const BACKGROUND_ORIGIN = dash(BACKGROUND, ORIGIN);
const BACKGROUND_POSITION = dash(BACKGROUND, POSITION);
const BACKGROUND_POSITION_X = dash(BACKGROUND, POSITION, X);
const BACKGROUND_POSITION_Y = dash(BACKGROUND, POSITION, Y);
const BACKGROUND_REPEAT = dash(BACKGROUND, REPEAT);
const BACKGROUND_SIZE = dash(BACKGROUND, SIZE);
const BACKGROUND_BLEND_MODE = dash(BACKGROUND, 'blend', MODE);
const BACKGROUND_ATTACHMENT = dash(BACKGROUND, 'attachment');
const GRADIENT = 'gradient';
const LINEAR_GRADIENT = dash(LINEAR, GRADIENT);
const RADIAL_GRADIENT = dash('radial', GRADIENT);
const CONIC_GRADIENT = dash('conic', GRADIENT);
const CONTENT_VISIBILITY = dash(CONTENT, VISIBILITY);
const STROKE_WIDTH = dash(STROKE, WIDTH);
const FILL_RULE = dash(FILL, RULE);
const COLOR_DODGE = dash(COLOR, 'dodge');
const COLOR_BURN = dash(COLOR, 'burn');
const HARD_LIGHT = dash('hard', LIGHT);
const SOFT_LIGHT = dash('soft', LIGHT);
const COLOR_MIX = dash(COLOR, 'mix');
const REVERT = 'revert';
const REVERT_LAYER = dash(REVERT, 'layer');

export const values: Record<string, Record<string, string | number>> = {
    uni: {
        ini: 'initial',
        inh: INHERIT,
        u: 'unset',
        r: REVERT,
        rl: REVERT_LAYER,
        a: AUTO,
        no: NONE
    },
    ali: {
        s: START,
        e: END,
        c: CENTER,
        st: STRETCH,
        sb: SPACE_BETWEEN,
        sa: SPACE_AROUND,
        se: SPACE_EVENLY,
        b: BASELINE,
        fs: FLEX_START,
        fe: FLEX_END,
        no: NONE
    },
    dis: {
        g: GRID,
        ig: INLINE_GRID,
        f: FLEX,
        if: INLINE_FLEX
    },
    fd: {
        r: ROW,
        rr: ROW_REVERSE,
        c: COLUMN,
        cr: COLUMN_REVERSE
    },
    fw: {
        w: WRAP,
        nw: NOWRAP,
        wr: WRAP_REVERSE
    },
    rep: {
        rx: REPEAT_X,
        ry: REPEAT_Y,
        r: REPEAT,
        s: SPACE,
        ro: 'round',
        nr: NO_REPEAT
    },
    ttf: {
        l: LINEAR,
        e: EASE,
        ei: EASE_IN,
        eo: EASE_OUT,
        eio: EASE_IN_OUT,
        ss: STEP_START,
        se: STEP_END
    },
    /**
     * White-space
     */
    ws: {
        n: NORMAL,
        nw: NOWRAP,
        p: PRE,
        pl: PRE_LINE,
        pw: PRE_WRAP,
        bs: BREAK_SPACES
    },
    wb: {
        n: NORMAL,
        ba: BREAK_ALL,
        ka: KEEP_ALL,
        bw: BREAK_WORD
    },
    wm: {
        htb: HORIZONTAL_TB,
        vlr: VERTICAL_LR,
        vrl: VERTICAL_RL
    },
    hyp: {
        no: NONE,
        m: MANUAL,
        a: AUTO
    },
    tt: {
        l: LOWERCASE,
        u: UPPERCASE,
        c: CAPITALIZE
    },
    td: {
        lt: LINE_THROUGH,
        o: OVERLINE,
        u: UNDERLINE
    },
    tor: {
        m: 'mixed',
        u: 'upright',
        sr: 'sideways-right',
        s: 'sideways',
        ugo: 'use-glyph-orientation'
    },
    ta: {
        l: LEFT,
        c: CENTER,
        j: JUSTIFY,
        r: RIGHT,
        s: START,
        e: END
    },
    tp: {
        all: ALL,
        col: comma(COLOR, BACKGROUND_COLOR, BORDER_COLOR, TEXT_DECORATION_COLOR),
        icon: comma(FILL, STROKE),
        filter: comma(FILTER, BACKDROP_FILTER),
        ind: comma(PADDING, MARGIN),
        sz: comma(WIDTH, MAX_WIDTH, MIN_WIDTH, HEIGHT, MAX_HEIGHT, MIN_HEIGHT),
        esz: comma(MIN_BLOCK_SIZE, BLOCK_SIZE, MAX_BLOCK_SIZE, MIN_INLINE_SIZE, INLINE_SIZE, MAX_INLINE_SIZE),
        o: OPACITY,
        b: BORDER,
        f: FLEX,
        g: GRID,
        pos: comma(POSITION, LEFT, TOP, BOTTOM, RIGHT),
        tf: comma(TRANSFORM, TRANSLATE, SCALE, ROTATE, SKEW, PERSPECTIVE)
    },
    lb: {
        a: AUTO,
        any: ANYWHERE,
        n: NORMAL,
        l: LOOSE,
        s: STRICT
    },
    ov: {
        h: HIDDEN,
        s: SCROLL,
        a: AUTO,
        c: CLIP,
        e: ELLIPSIS
    },
    v: {
        h: HIDDEN,
        v: VISIBLE,
        c: COLLAPSE,
        a: AUTO
    },
    wc: {
        a: AUTO,
        sp: SCROLL_POSITION,
        c: CONTENTS,
        tf: TRANSFORM,
        o: OPACITY,
        i: INSET,
        tfi: TRANSFORM + ',' + INSET
    },
    afm: {
        no: NONE,
        f: FORWARDS,
        b: BACKWARDS,
        both: BOTH
    },
    adir: {
        r: REVERSE,
        a: ALTERNATE,
        ar: ALTERNATE_REVERSE
    },
    aps: {
        r: RUNNING,
        p: PAUSED
    },
    tb: {
        ad: ALLOW_DISCRETE,
        n: NORMAL
    },
    app: {
        n: NONE,
        a: AUTO
    },
    pe: {
        a: AUTO,
        no: NONE,
        all: ALL,
        f: FILL,
        s: STROKE
    },
    cur: {
        h: HELP,
        a: AUTO,
        p: POINTER,
        cm: CONTEXT_MENU,
        pr: PROGRESS,
        w: WAIT,
        cell: CELL,
        crh: CROSSHAIR,
        t: TEXT,
        vt: VERTICAL_TEXT,
        cp: COPY,
        m: MOVE,
        g: GRAB,
        gng: GRABBING,
        cr: COL_RESIZE,
        rr: ROW_RESIZE,
        nr: N_RESIZE,
        er: E_RESIZE,
        sr: S_RESIZE,
        wr: W_RESIZE,
        ner: NE_RESIZE,
        ewr: EW_RESIZE,
        nwr: NW_RESIZE,
        ser: SE_RESIZE,
        swr: SW_RESIZE,
        nsr: NS_RESIZE,
        neswr: NESW_RESIZE,
        nwser: NWSE_RESIZE,
        zi: ZOOM_IN,
        zo: ZOOM_OUT
    },
    res: {
        n: NONE,
        v: VERTICAL,
        h: HORIZONTAL,
        b: BOTH
    },
    toa: {
        a: AUTO,
        no: NONE,
        px: PAN_X,
        pl: PAN_LEFT,
        pr: PAN_RIGHT,
        py: PAN_Y,
        pu: PAN_UP,
        pd: PAN_DOWN,
        pz: PINCH_ZOOM,
        m: MANIPULATION
    },
    us: {
        n: NONE,
        t: TEXT,
        all: ALL,
        a: AUTO
    },
    sb: {
        a: AUTO,
        s: SMOOTH
    },
    // scroll-snap-stop
    sss: {
        n: NORMAL,
        a: ALWAYS
    },
    // scroll-snap-type
    sst: {
        n: NONE,
        x: X,
        y: Y,
        b: BLOCK,
        i: INLINE,
        both: BOTH,
        xm: X_MANDATORY,
        ym: Y_MANDATORY,
        bm: BLOCK_MANDATORY,
        im: INLINE_MANDATORY,
        bothm: BOTH_MANDATORY,
        xp: X_PROXIMITY,
        yp: Y_PROXIMITY,
        bp: BLOCK_PROXIMITY,
        ip: INLINE_PROXIMITY,
        bothp: BOTH_PROXIMITY
    },
    fst: {
        i: ITALIC,
        n: NORMAL,
        o: OBLIQUE
    },
    pos: {
        r: RELATIVE,
        a: ABSOLUTE,
        f: FIXED,
        s: STATIC
    },
    posv: {
        b: BOTTOM,
        t: TOP,
        c: CENTER,
        l: LEFT,
        r: RIGHT,
        lt: LEFT_TOP,
        rt: RIGHT_TOP,
        lb: LEFT_BOTTOM,
        rb: RIGHT_BOTTOM
    },
    // content-size
    csz: {
        cv: COVER,
        cn: CONTAIN,
        a: AUTO,
        f: FILL,
        sd: SCALE_DOWN
    },
    // column-fill
    cf: {
        a: AUTO,
        b: BALANCE
    },
    cs: {
        no: NONE,
        all: ALL
    },
    box: {
        c: CONTENT_BOX,
        p: PADDING_BOX,
        b: BORDER_BOX,
        f: FILL_BOX,
        s: STROKE_BOX,
        v: VIEW_BOX,
        nc: NO_CLIP,
        t: TEXT
    },
    mcm: {
        a: ADD,
        s: SUBTRACT,
        i: INTERSECT,
        e: EXCLUDE
    },
    mtp: {
        a: ALPHA,
        l: LUMINANCE
    },
    // mask-mode
    mm: {
        a: ALPHA,
        l: LUMINANCE,
        m: MATCH_SOURCE
    },
    // background-blend-mode
    bgbm: {
        n: NORMAL,
        m: 'multiply',
        scr: 'screen',
        o: 'overlay',
        d: DARK + 'en',
        l: LIGHT + 'en',
        dif: 'difference',
        exc: 'exclusion',
        h: HUE,
        sat: 'saturation',
        c: COLOR,
        lum: 'luminosity',
        cd: COLOR_DODGE,
        cb: COLOR_BURN,
        hl: HARD_LIGHT,
        sl: SOFT_LIGHT
    },
    bga: {
        s: SCROLL,
        f: FIXED,
        l: LOCAL
    },
    ls: {
        no: NONE,
        dt: DOTTED,
        i: INSET,
        h: HIDDEN,
        ds: DASHED,
        s: SOLID,
        db: DOUBLE,
        o: OUTSET,
        r: RIDGE,
        g: GROOVE
    },
    usz: {
        min: MIN_CONTENT,
        max: MAX_CONTENT,
        fit: FIT_CONTENT,
        no: 0,
        a: AUTO
    }
};

export const keys: Record<string, string> = {
    // animation
    a: ANIMATION,
    an: ANIMATION_NAME,
    adur: ANIMATION_DURATION,
    adel: ANIMATION_DELAY,
    aps: ANIMATION_PLAY_STATE,
    afm: ANIMATION_FILL_MODE,
    adir: ANIMATION_DIRECTION,
    aic: ANIMATION_ITERATION_COUNT,
    atf: ANIMATION_TIMING_FUNCTION,
    // transition
    tdur: TRANSITION_DURATION,
    tdel: TRANSITION_DELAY,
    tb: TRANSITION_BEHAVIOR,
    tp: TRANSITION_PROPERTY,
    ttf: TRANSITION_TIMING_FUNCTION,
    // border
    bor: BORDER,
    bw: BORDER_WIDTH,
    br: BORDER_RADIUS,
    bs: BORDER_STYLE,
    bls: BORDER_LEFT_STYLE,
    brs: BORDER_RIGHT_STYLE,
    bts: BORDER_TOP_STYLE,
    bbs: BORDER_BOTTOM_STYLE,
    bbls: BORDER_BLOCK_STYLE,
    bis: BORDER_INLINE_STYLE,
    bbss: BORDER_BLOCK_START_STYLE,
    bbes: BORDER_BLOCK_END_STYLE,
    biss: BORDER_INLINE_START_STYLE,
    bies: BORDER_INLINE_END_STYLE,
    brw: BORDER_RIGHT_WIDTH,
    blw: BORDER_LEFT_WIDTH,
    btw: BORDER_TOP_WIDTH,
    bbw: BORDER_BOTTOM_WIDTH,
    btlr: BORDER_TOP_LEFT_RADIUS,
    btrr: BORDER_TOP_RIGHT_RADIUS,
    bbrr: BORDER_BOTTOM_RIGHT_RADIUS,
    bblr: BORDER_BOTTOM_LEFT_RADIUS,

    biw: BORDER_INLINE_WIDTH,
    bblw: BORDER_BLOCK_WIDTH,
    // border block start radius
    bbew: BORDER_BLOCK_END_WIDTH,
    bbsw: BORDER_BLOCK_START_WIDTH,
    bisw: BORDER_INLINE_START_WIDTH,
    biew: BORDER_INLINE_END_WIDTH,
    besr: BORDER_END_START_RADIUS,
    beer: BORDER_END_END_RADIUS,
    bssr: BORDER_START_START_RADIUS,
    bser: BORDER_START_END_RADIUS,
    bc: BORDER_COLOR,
    blc: BORDER_LEFT_COLOR,
    brc: BORDER_RIGHT_COLOR,
    btc: BORDER_TOP_COLOR,
    bbc: BORDER_BOTTOM_COLOR,
    bblc: BORDER_BLOCK_COLOR,
    bic: BORDER_INLINE_COLOR,
    bbsc: BORDER_BLOCK_START_COLOR,
    bbec: BORDER_BLOCK_END_COLOR,
    bisc: BORDER_INLINE_START_COLOR,
    biec: BORDER_INLINE_END_COLOR,
    // palette
    bgc: BACKGROUND_COLOR,
    c: COLOR,
    acc: ACCENT_COLOR,
    ctc: CARET_COLOR,
    st: STROKE,
    fi: FILL,
    flt: FILTER,
    bf: BACKDROP_FILTER,

    // grid && flex
    g: GRID,
    f: FLEX,
    dis: DISPLAY,
    jc: JUSTIFY_CONTENT,
    ji: JUSTFY_ITEMS,
    ai: ALIGN_ITEMS,
    ac: ALIGN_CONTENT,
    gtr: GRID_TEMPLATE_ROWS,
    gtc: GRID_TEMPLATE_COLUMNS,
    rg: ROW_GAP,
    cg: COLUMN_GAP,

    as: ALIGN_SELF,
    js: JUSTFY_SELF,
    gre: GRID_ROW_END,
    grs: GRID_ROW_START,
    gce: GRID_COLUMN_END,
    gcs: GRID_COLUMN_START,

    fd: FLEX_DIRECTION,
    fw: FLEX_WRAP,
    fs: FLEX_SHRINK,
    fg: FLEX_GROW,
    fb: FLEX_BASIS,
    ord: ORDER,

    // indents
    m: MARGIN,
    ml: MARGIN_LEFT,
    mr: MARGIN_RIGHT,
    mt: MARGIN_TOP,
    mb: MARGIN_BOTTOM,
    p: PADDING,
    pl: PADDING_LEFT,
    pr: PADDING_RIGHT,
    pt: PADDING_TOP,
    pb: PADDING_BOTTOM,
    // outline
    oc: OUTLINE_COLOR,
    ow: OUTLINE_WIDTH,
    os: OUTLINE_STYLE,
    oo: OUTLINE_OFFSET,
    // position
    l: LEFT,
    r: RIGHT,
    t: TOP,
    b: BOTTOM,
    // inset
    ins: INSET,
    ib: INSET_BLOCK,
    ibe: INSET_BLOCK_END,
    ibs: INSET_BLOCK_START,
    ii: INSET_INLINE,
    iie: INSET_INLINE_END,
    iis: INSET_INLINE_START,
    // interaction
    wc: WILL_CHANGE,
    app: APPEARANCE,
    pe: POINTER_EVENTS,
    cur: CURSOR,
    toa: TOUCH_ACTION,
    us: USER_SELECT,
    res: RESIZE,
    // scroll
    sb: SCROLL_BEHAVIOR,
    ssa: SCROLL_SNAP_ALIGN,
    sss: SCROLL_SNAP_STOP,
    sst: SCROLL_SNAP_TYPE,
    sm: SCROLL_MARGIN,
    sml: SCROLL_MARGIN_LEFT,
    smr: SCROLL_MARGIN_RIGHT,
    smt: SCROLL_MARGIN_TOP,
    smb: SCROLL_MARGIN_BOTTOM,
    sp: SCROLL_PADDING,
    spl: SCROLL_PADDING_LEFT,
    spr: SCROLL_PADDING_RIGHT,
    spt: SCROLL_PADDING_TOP,
    spb: SCROLL_PADDING_BOTTOM,
    smbl: SCROLL_MARGIN_BLOCK,
    smbe: SCROLL_MARGIN_BLOCK_END,
    smbs: SCROLL_MARGIN_BLOCK_START,
    smi: SCROLL_MARGIN_INLINE,
    smie: SCROLL_MARGIN_INLINE_END,
    smis: SCROLL_MARGIN_INLINE_START,
    spbl: SCROLL_PADDING_BLOCK,
    spbe: SCROLL_PADDING_BLOCK_END,
    spbs: SCROLL_PADDING_BLOCK_START,
    spi: SCROLL_PADDING_INLINE,
    spie: SCROLL_PADDING_INLINE_END,
    spis: SCROLL_PADDING_INLINE_START,
    // size
    ar: ASPECT_RATIO,
    w: WIDTH,
    maxw: MAX_WIDTH,
    minw: MIN_WIDTH,
    h: HEIGHT,
    minh: MIN_HEIGHT,
    maxh: MAX_HEIGHT,
    bl: BLOCK_SIZE,
    maxb: MAX_BLOCK_SIZE,
    minb: MIN_BLOCK_SIZE,
    i: INLINE_SIZE,
    mini: MIN_INLINE_SIZE,
    maxi: MAX_INLINE_SIZE,
    // transformations
    per: PERSPECTIVE,
    pero: PERSPECTIVE_ORIGIN,
    rot: ROTATE,
    sc: SCALE,
    tf: TRANSFORM,
    tfb: TRANSFORM_BOX,
    tfo: TRANSFORM_ORIGIN,
    tfs: TRANSFORM_STYLE,
    tr: TRANSLATE,
    z: ZOOM,
    // typography
    lts: LETTER_SPACING,
    lh: LINE_HEIGHT,
    lb: LINE_BREAK,
    fst: FONT_STYLE,
    ff: FONT_FAMILY,
    fwg: FONT_WEIGHT,
    fsz: FONT_SIZE,
    tt: TEXT_TRANSFORM,
    td: TEXT_DECORATION,
    ta: TEXT_ALIGN,
    to: TEXT_OVERFLOW,
    ws: WHITE_SPACE,
    tor: TEXT_ORIENTATION,
    wb: WORD_BREAK,
    wm: WRITING_MODE,
    hyp: HYPHENS,
    bsz: BOX_SIZING,
    bsh: BOX_SHADOW,
    pos: POSITION,
    // column
    cf: COLUMN_FILL,
    crs: COLUMN_RULE_STYLE,
    crc: COLUMN_RULE_COLOR,
    crw: COLUMN_RULE_WIDTH,
    cs: COLUMN_SPAN,
    cw: COLUMN_WIDTH,
    cc: COLUMN_COUNT,
    // background
    bgcl: BACKGROUND_CLIP,
    bgp: BACKGROUND_POSITION,
    bgpx: BACKGROUND_POSITION_X,
    bgpy: BACKGROUND_POSITION_Y,
    bgbm: BACKGROUND_BLEND_MODE,
    bgo: BACKGROUND_ORIGIN,
    bgr: BACKGROUND_REPEAT,
    bga: BACKGROUND_ATTACHMENT,
    bgsz: BACKGROUND_SIZE,
    // mask
    mcl: MASK_CLIP,
    mcm: MASK_COMPOSITE,
    mm: MASK_MODE,
    mo: MASK_ORIGIN,
    mp: MASK_POSITION,
    mre: MASK_REPEAT,
    msz: MASK_SIZE,
    mtp: MASK_TYPE,
    // object
    obf: OBJECT_FIT,
    obp: OBJECT_POSITION,
    // view
    cnt: CONTENT,
    ov: OVERFLOW,
    ovx: OVERFLOW_X,
    ovy: OVERFLOW_Y,
    v: VISIBILITY,
    cv: CONTENT_VISIBILITY,
    o: OPACITY,
    zi: Z_INDEX,
    zm: ZOOM,
    lg: LINEAR_GRADIENT,
    inf: INFINITE,
    r_: ':root',
    '': '*',
    /**
     * :hover
     */
    h_: ':hover',
    /**
     * :focus
     */
    f_: ':focus',
    /**
     * :active
     */
    a_: ':active',
    /**
     * :visited
     */
    v_: ':visited',
    /**
     * :valid
     */
    val_: ':valid',
    /**
     * :invalid
     */
    inv_: ':invalid',
    /**
     * :empty
     */
    e_: ':empty',
    /**
     * :disabled
     */
    d_: ':disabled',

    // collections

    /**
     * :first-child
     */
    fc_: ':first-child',
    /**
     * :last-child
     */
    lc_: ':last-child',
    /**
     * :only-child
     */
    oc_: ':only-child',
    /**
     * :nth-child(odd)
     */
    odd_: ':nth-child(odd)',
    /**
     * :nth-child(even)
     */
    even_: ':nth-child(even)',
    /**
     * :first-of-type
     */
    ft_: ':first-of-type',
    /**
     * :last-of-type
     */
    lt_: ':last-of-type',
    /**
     * :only-of-type
     */
    ot_: ':only-of-type',

    // pseudoelements

    /**
     * ::before
     */
    bef_: '::before',
    /**
     * ::after
     */
    aft_: '::after',
    /**
     * ::backdrop
     */
    bd_: '::backdrop',
    ba_: '&::before,&::after',
    light_: '@media(prefers-color-scheme: light)',
    dark_: '@media(prefers-color-scheme: dark)'
};

export type IGlobalValues = typeof values;
export type IGlobalKeys = typeof keys;
