import { comma, dash, space } from './functions';

const X = 'x';
const Y = 'y';
const STATIC = 'static';
const UP = 'up';
const DOWN = 'down';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const TEXT = 'text';
const TEXT_ = TEXT + '-';
const FONT = 'font';
const COLUMN = 'column';
const MAX = 'max';
const MAX_ = MAX + '-';
const MIN = 'min';
const MIN_ = MIN + '-';
const CONTENT = 'content';
const CONTENTS = CONTENT + 's';
const ITEMS = 'items';
const SELF = 'self';
const DISPLAY = 'display';
const INLINE = 'inline';
const BLOCK = 'block';
const SIZE = 'size';
const RADIUS = 'radius';
const _RADIUS = '-' + RADIUS;
const DIRECTION = 'direction';
const OUTLINE = 'outline';
const STYLE = 'style';
const _STYLE = '-' + STYLE;
const BALANCE = 'balance';
const END = 'end';
const _END = '-' + END;
const START = 'start';
const _START = '-' + START;
const CENTER = 'center';
const DECORATION = 'decoration';
const WORD = 'word';
const LINE = 'line';
const BREAK = 'break';
const WRAP = 'wrap';
const NOWRAP = 'nowrap';
const TEMPLATE = 'template';
const RULE = 'rule';
const COUNT = 'count';
const OBJECT = 'object';
const FIT = 'fit';
const TOP = 'top';
const _TOP = '-' + TOP;
const LEFT = 'left';
const _LEFT = '-' + LEFT;
const BOTTOM = 'bottom';
const _BOTTOM = '-' + BOTTOM;
const RIGHT = 'right';
const _RIGHT = '-' + RIGHT;
const WIDTH = 'width';
const _WIDTH = '-' + WIDTH;
const COLOR = 'color';
const _COLOR = '-' + COLOR;
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
const BEHAVIOR = 'behavior';
const ORIENTATION = 'orientation';

// values
const COLOR_SCHEME = dash(COLOR, 'scheme');
const BORDER_BOTTOM = BORDER + _BOTTOM;
const BORDER_LEFT = BORDER + _LEFT;
const BORDER_RIGHT = BORDER + _RIGHT;
const BORDER_TOP = BORDER + _TOP;
const BORDER_BLOCK = dash(BORDER, BLOCK);
const BORDER_INLINE = dash(BORDER, INLINE);
const BORDER_BLOCK_START = BORDER_BLOCK + _START;
const BORDER_BLOCK_END = BORDER_BLOCK + _END;
const BORDER_INLINE_START = BORDER_INLINE + _START;
const BORDER_INLINE_END = BORDER_INLINE + _END;
// border-width
const BORDER_WIDTH = BORDER + _WIDTH;
const BORDER_BOTTOM_WIDTH = BORDER_BOTTOM + _WIDTH;
const BORDER_LEFT_WIDTH = BORDER_LEFT + _WIDTH;
const BORDER_RIGHT_WIDTH = BORDER_RIGHT + _WIDTH;
const BORDER_TOP_WIDTH = BORDER_TOP + _WIDTH;
const BORDER_BLOCK_WIDTH = BORDER_BLOCK + _WIDTH;
const BORDER_INLINE_WIDTH = BORDER_INLINE + _WIDTH;
const BORDER_BLOCK_START_WIDTH = BORDER_BLOCK_START + _WIDTH;
const BORDER_BLOCK_END_WIDTH = BORDER_BLOCK_END + _WIDTH;
const BORDER_INLINE_START_WIDTH = BORDER_INLINE_START + _WIDTH;
const BORDER_INLINE_END_WIDTH = BORDER_INLINE_END + _WIDTH;
// border-radius
const BORDER_RADIUS = BORDER + _RADIUS;
const BORDER_BOTTOM_LEFT_RADIUS = BORDER_BOTTOM + _LEFT + _RADIUS;
const BORDER_BOTTOM_RIGHT_RADIUS = BORDER_BOTTOM + _RIGHT + _RADIUS;
const BORDER_TOP_LEFT_RADIUS = BORDER_TOP + _LEFT + _RADIUS;
const BORDER_TOP_RIGHT_RADIUS = BORDER_TOP + _RIGHT + _RADIUS;
const BORDER_START_END_RADIUS = BORDER + _START + _END + _RADIUS;
const BORDER_START_START_RADIUS = BORDER + _START + _START + _RADIUS;
const BORDER_END_END_RADIUS = BORDER + _END + _END + _RADIUS;
const BORDER_END_START_RADIUS = BORDER + _END + _START + _RADIUS;
// border-color
const BORDER_COLOR = BORDER + _COLOR;
const BORDER_LEFT_COLOR = BORDER_LEFT + _COLOR;
const BORDER_RIGHT_COLOR = BORDER_RIGHT + _COLOR;
const BORDER_TOP_COLOR = BORDER_TOP + _COLOR;
const BORDER_BOTTOM_COLOR = BORDER_BOTTOM + _COLOR;
const BORDER_BLOCK_COLOR = BORDER_BLOCK + _COLOR;
const BORDER_INLINE_COLOR = BORDER_INLINE + _COLOR;
const BORDER_BLOCK_START_COLOR = BORDER_BLOCK_START + _COLOR;
const BORDER_BLOCK_END_COLOR = BORDER_BLOCK_END + _COLOR;
const BORDER_INLINE_START_COLOR = BORDER_INLINE_START + _COLOR;
const BORDER_INLINE_END_COLOR = BORDER_INLINE_END + _COLOR;
// border-style
const BORDER_STYLE = BORDER + _STYLE;
const BORDER_LEFT_STYLE = BORDER_LEFT + _STYLE;
const BORDER_RIGHT_STYLE = BORDER_RIGHT + _STYLE;
const BORDER_TOP_STYLE = BORDER_TOP + _STYLE;
const BORDER_BOTTOM_STYLE = BORDER_BOTTOM + _STYLE;
const BORDER_BLOCK_STYLE = BORDER_BLOCK + _STYLE;
const BORDER_INLINE_STYLE = BORDER_INLINE + _STYLE;
const BORDER_BLOCK_START_STYLE = BORDER_BLOCK_START + _STYLE;
const BORDER_BLOCK_END_STYLE = BORDER_BLOCK_END + _STYLE;
const BORDER_INLINE_START_STYLE = BORDER_INLINE_START + _STYLE;
const BORDER_INLINE_END_STYLE = BORDER_INLINE_END + _STYLE;
// outline
const OUTLINE_COLOR = OUTLINE + _COLOR;
const OUTLINE_WIDTH = OUTLINE + _WIDTH;
const OUTLINE_STYLE = OUTLINE + _STYLE;
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
const PADDING_LEFT = PADDING + _LEFT;
const PADDING_TOP = PADDING + _TOP;
const PADDING_RIGHT = PADDING + _RIGHT;
const PADDING_BOTTOM = PADDING + _BOTTOM;

const MARGIN_LEFT = MARGIN + _LEFT;
const MARGIN_TOP = MARGIN + _TOP;
const MARGIN_RIGHT = MARGIN + _RIGHT;
const MARGIN_BOTTOM = MARGIN + _BOTTOM;

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
const PLACE_ITEMS = dash('place', ITEMS);
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
const GRID_ROW = dash(GRID, ROW);
const GRID_ROW_END = GRID_ROW + _END;
const GRID_ROW_START = GRID_ROW + _START;
const GRID_COLUMN = dash(GRID, COLUMN);
const GRID_COLUMN_END = GRID_COLUMN + _END;
const GRID_COLUMN_START = GRID_COLUMN + _START;
const COLUMN_COUNT = dash(COLUMN, COUNT);
const COLUMN_FILL = dash(COLUMN, FILL);
const COLUMN_RULE = dash(COLUMN, RULE);
const COLUMN_RULE_COLOR = COLUMN_RULE + _COLOR;
const COLUMN_RULE_STYLE = COLUMN_RULE + _STYLE;
const COLUMN_RULE_WIDTH = COLUMN_RULE + _WIDTH;
const COLUMN_SPAN = dash(COLUMN, SPAN);
const COLUMN_WIDTH = COLUMN + _WIDTH;
const ROW_REVERSE = dash(ROW, REVERSE);
const COLUMN_REVERSE = dash(COLUMN, REVERSE);
const WRAP_REVERSE = dash(WRAP, REVERSE);
const FLEX_END = FLEX + _END;
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
const ANIMATION_ = 'animation' + '-';
const ANIMATION_NAME = ANIMATION_ + 'name';
const ANIMATION_TIMING_FUNCTION = ANIMATION_ + TIMING_FUNCTION;
const ANIMATION_DIRECTION = ANIMATION_ + DIRECTION;
const ANIMATION_ITERATION_COUNT = ANIMATION_ + ITERATION_COUNT;
const ANIMATION_DURATION = ANIMATION_ + DURATION;
const ANIMATION_DELAY = ANIMATION_ + DELAY;
const ANIMATION_PLAY_STATE = ANIMATION_ + 'play-state';
const ANIMATION_FILL_MODE = ANIMATION_ + dash(FILL, MODE);
const TRANSITION = 'transition';
const TRANSITION_ = TRANSITION + '-';
const TRANSITION_BEHAVIOR = TRANSITION_ + BEHAVIOR;
const TRANSITION_PROPERTY = TRANSITION_ + 'property';
const TRANSITION_TIMING_FUNCTION = TRANSITION_ + TIMING_FUNCTION;
const TRANSITION_DURATION = TRANSITION_ + DURATION;
const TRANSITION_DELAY = TRANSITION_ + DELAY;

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
const STEP_START = STEP + _START;
const STEP_END = STEP + _END;

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
const INSET_ = INSET + '-';
const TRANSFORM_BOX = dash(TRANSFORM, BOX);
const TRANSFORM_ORIGIN = dash(TRANSFORM, ORIGIN);
const TRANSFORM_STYLE = TRANSFORM + _STYLE;
const INSET_BLOCK = INSET_ + BLOCK;
const INSET_BLOCK_END = INSET_BLOCK + _END;
const INSET_BLOCK_START = INSET_BLOCK + _START;
const INSET_INLINE = INSET_ + INLINE;
const INSET_INLINE_END = INSET_INLINE + _END;
const INSET_INLINE_START = INSET_INLINE + _START;
const FIT_CONTENT = dash(FIT, CONTENT);
const MIN_CONTENT = MIN_ + CONTENT;
const MAX_CONTENT = MAX_ + CONTENT;
const ASPECT_RATIO = 'aspect-ratio';
const BOX_SIZING = dash(BOX, 'sizing');

const MAX_WIDTH = MAX_ + WIDTH;
const MIN_WIDTH = MIN_ + WIDTH;

const MAX_HEIGHT = MAX_ + HEIGHT;
const MIN_HEIGHT = MIN_ + HEIGHT;

const BLOCK_SIZE = dash(BLOCK, SIZE);
const MAX_BLOCK_SIZE = MAX_ + BLOCK_SIZE;
const MIN_BLOCK_SIZE = MIN_ + BLOCK_SIZE;

const INLINE_SIZE = dash(INLINE, SIZE);
const MAX_INLINE_SIZE = MAX_ + INLINE_SIZE;
const MIN_INLINE_SIZE = MIN_ + INLINE_SIZE;

const SNAP = 'snap';

const SCROLL_BEHAVIOR = dash(SCROLL, BEHAVIOR);
const SCROLL_MARGIN = dash(SCROLL, MARGIN);
const SCROLL_MARGIN_TOP = SCROLL_MARGIN + _TOP;
const SCROLL_MARGIN_BOTTOM = SCROLL_MARGIN + _BOTTOM;
const SCROLL_MARGIN_LEFT = SCROLL_MARGIN + _LEFT;
const SCROLL_MARGIN_RIGHT = SCROLL_MARGIN + _RIGHT;

const SCROLL_MARGIN_BLOCK = dash(SCROLL_MARGIN, BLOCK);
const SCROLL_MARGIN_BLOCK_END = SCROLL_MARGIN_BLOCK + _END;
const SCROLL_MARGIN_BLOCK_START = SCROLL_MARGIN_BLOCK + _START;
const SCROLL_MARGIN_INLINE = dash(SCROLL_MARGIN, INLINE);
const SCROLL_MARGIN_INLINE_END = SCROLL_MARGIN_INLINE + _END;
const SCROLL_MARGIN_INLINE_START = SCROLL_MARGIN_INLINE + _START;

const SCROLL_PADDING = dash(SCROLL, PADDING);
const SCROLL_PADDING_TOP = SCROLL_PADDING + _TOP;
const SCROLL_PADDING_BOTTOM = SCROLL_PADDING + _BOTTOM;
const SCROLL_PADDING_LEFT = SCROLL_PADDING + _LEFT;
const SCROLL_PADDING_RIGHT = SCROLL_PADDING + _RIGHT;

const SCROLL_PADDING_BLOCK = dash(SCROLL_PADDING, BLOCK);
const SCROLL_PADDING_BLOCK_END = SCROLL_PADDING_BLOCK + _END;
const SCROLL_PADDING_BLOCK_START = SCROLL_PADDING_BLOCK + _START;
const SCROLL_PADDING_INLINE = dash(SCROLL_PADDING, INLINE);
const SCROLL_PADDING_INLINE_END = SCROLL_PADDING_INLINE + _END;
const SCROLL_PADDING_INLINE_START = SCROLL_PADDING_INLINE + _START;

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
const TEXT_DECORATION = TEXT_ + DECORATION;
const TEXT_DECORATION_COLOR = dash(TEXT_DECORATION, COLOR);
const WHITE_SPACE = 'white-space';
const TEXT_TRANSFORM = TEXT_ + TRANSFORM;
const TEXT_ALIGN = TEXT_ + ALIGN;
const TEXT_OVERFLOW = TEXT_ + OVERFLOW;
const TEXT_ORIENTATION = TEXT_ + ORIENTATION;
const TEXT_RENDERING = TEXT_ + 'rendering';
const TEXT_SHADOW = TEXT_ + SHADOW;
const TEXT_EMPHASIS = TEXT_ + 'emphasis';
const TEXT_WRAP = TEXT_ + WRAP;
const WORD_BREAK = dash(WORD, BREAK);

const FONT_SIZE = dash(FONT, SIZE);
const FONT_WEIGHT = FONT + '-weight';
const FONT_FAMILY = FONT + '-family';
const FONT_STYLE = FONT + _STYLE;
const FONT_SYNTHESIS = dash(FONT, 'synthesis');
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
const CARET_COLOR = 'caret' + _COLOR;
const ACCENT_COLOR = 'accent' + _COLOR;
const FILTER = 'filter';
const BACKDROP_FILTER = 'backdrop-' + FILTER;
const TRANSPARENT = 'transparent';
const BACKGROUND = 'background';
const BACKGROUND_COLOR = BACKGROUND + _COLOR;
const BACKGROUND_CLIP = dash(BACKGROUND, CLIP);
const BACKGROUND_ORIGIN = dash(BACKGROUND, ORIGIN);
const BACKGROUND_POSITION = dash(BACKGROUND, POSITION);
const BACKGROUND_POSITION_X = dash(BACKGROUND_POSITION, X);
const BACKGROUND_POSITION_Y = dash(BACKGROUND_POSITION, Y);
const BACKGROUND_REPEAT = dash(BACKGROUND, REPEAT);
const BACKGROUND_SIZE = dash(BACKGROUND, SIZE);
const BACKGROUND_BLEND_MODE = dash(BACKGROUND, 'blend', MODE);
const BACKGROUND_ATTACHMENT = dash(BACKGROUND, 'attachment');
const GRADIENT = 'gradient';
const LINEAR_GRADIENT = dash(LINEAR, GRADIENT);
const RADIAL_GRADIENT = dash('radial', GRADIENT);
const CONIC_GRADIENT = dash('conic', GRADIENT);
const CONTENT_VISIBILITY = dash(CONTENT, VISIBILITY);
const STROKE_WIDTH = STROKE + _WIDTH;
const FILL_RULE = dash(FILL, RULE);
const COLOR_DODGE = dash(COLOR, 'dodge');
const COLOR_BURN = dash(COLOR, 'burn');
const HARD_LIGHT = dash('hard', LIGHT);
const SOFT_LIGHT = dash('soft', LIGHT);
const COLOR_MIX = dash(COLOR, 'mix');
const REVERT = 'revert';
const REVERT_LAYER = dash(REVERT, 'layer');
const CONTAINER = 'container';
const CONTAINER_TYPE = dash(CONTAINER, TYPE);
const CONTAINER_NAME = dash(CONTAINER, 'name');

// pseudo & media
const COLON_FIRST = ':first-';
const COLON_LAST = ':last-';
const COLON_ONLY = ':only-';
const CHILD = 'child';
const OF_TYPE = 'of-type';
const NTH_CHILD = ':nth-child';
const PREFERS_ = 'prefers-';
const PREFERS_COLOR_SCHEME = PREFERS_ + COLOR_SCHEME;
const AT_MEDIA = '@media';
const COLOR_GAMUT = 'color-gamut';
const PREFERS_CONTRAST = PREFERS_ + 'contrast';
const SCRIPTING = 'scripting';

/**
 * Scoped unitless values
 */
const scu = {
    0: 0,
    '1/4': 25,
    '1/2': 50,
    '3/4': 75,
    1: 100
};

const perc = {
    0: 0,
    '1/12': '0.0833',
    '1/10': '0.1',
    '1/6': '0.1667',
    '1/5': '0.2',
    '1/4': '0.25',
    '3/10': '0.3',
    '1/3': '0.3333',
    '2/5': '0.4',
    '5/12': '0.4167',
    '1/2': '0.5',
    '7/12': '0.5833',
    '3/5': '0.6',
    '2/3': '0.6667',
    '7/10': '0.7',
    '3/4': '0.75',
    '4/5': '0.8',
    '5/6': '0.8333',
    '9/10': '0.9',
    '11/12': '0.9167',
    1: '1'
};

/**
 * Coefficients
 */
const coef = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, val) => {
    acc[val] = val;
    return acc;
}, {} as Record<number, number>);

export const values: Record<string, Record<string, string | number>> = {
    /**
     * Lightness
     */
    lig: {
        /**
         * 
         */
        def: 0.75,
        // contrast
        c: 0.05,
        s: 0.65,
        m: 0.75,
        l: 0.85,
        // neutral
        n: 0.9
    },
    /**
     * Hue
     */
    hue: {
        def: 261.35,
        // brand
        b: 261.35,
        // info
        i: 194.77,
        // error
        e: 29.23,
        // warning
        w: 70.66,
        // success
        s: 142.49
    },
    /**
     * Chroma
     */
    chr: {
        def: 0.03,
        xs: 0.03,
        s: 0.06,
        m: 0.1,
        l: 0.15,
        xl: 0.25
    },
    /**
     * Alpha
     */
    alp: {
        def: 1,
        min: 0,
        xs: 0.1,
        s: 0.25,
        m: 0.5,
        l: 0.75,
        xl: 0.9,
        max: 1
    },
    /**
     * Root font-size
     */
    rem: {
        def: 16
    },
    /**
     * Font-family
     */
    ff: {
        def: 'Roboto, sans-serif',
        b: 'Georgia, serif'
    },
    /**
     * Font-weight
     */
    fwg: {
        xs: 100,
        s: 200,
        m: 400,
        l: 600,
        xl: 700
    },
    /**
     * Time
     */
    time: {
        def: 300,
        xs: 100,
        s: 200,
        m: 300,
        l: 450,
        xl: 600,
        no: 0,
        min: 50,
        max: 750
    },
    /**
     * Coefficients
     */
    coef,
    /**
     * Ratio coefficients
     */
    rat: {
        1: 1,
        '2/1': 2,
        '1/2': 0.5,
        '4/3': 1.3333,
        '3/4': 0.75,
        '9/16': 0.5625,
        '16/9': 1.7778
    },
    /**
     * Spacing
     */
    sp: {
        '3xs': 0.125,
        '2xs': 0.25,
        xs: 0.5,
        s: 0.75,
        m: 1,
        l: 1.25,
        xl: 1.5,
        '2xl': 2,
        '3xl': 4
    },
    /**
     * Size
     */
    sz: {
        '3xs': 1,
        '2xs': 1.5,
        xs: 2,
        s: 5,
        m: 10,
        l: 15,
        xl: 20,
        '2xl': 25,
        '3xl': 30
    },
    /**
     * Universal size
     */
    szu: {
        a: 'auto',
        no: 0,
        min: MIN_CONTENT,
        max: MAX_CONTENT,
        fit: FIT_CONTENT
    },
    /**
     * Media breakpoints
     */
    bp: {
        xs: 30,
        sm: 40,
        md: 48,
        lg: 64,
        xl: 80
    },
    /**
     * Container breakpoints
     */
    cbp: {
        xs: 10,
        sm: 20,
        md: 30,
        lg: 40,
        xl: 48
    },
    /**
     * Opacity
     */
    o: {
        min: 0,
        xs: 0.1,
        s: 0.25,
        m: 0.5,
        l: 0.75,
        xl: 0.9,
        max: 1
    },
    /**
     * Viewport width
     */
    vw: scu,
    /**
     * Viewport height
     */
    vh: scu,
    /**
     * Viewport min size
     */
    vmin: scu,
    /**
     * Viewport max size
     */
    vmax: scu,
    /**
     * Query container's width
     */
    cqw: scu,
    /**
     * Query container's height
     */
    cqh: scu,
    /**
     * Query container's block size
     */
    cqb: scu,
    /**
     * Query container's inline size
     */
    cqi: scu,
    /**
     * Query container's min size
     */
    cqmin: scu,
    /**
     * Query container's max size
     */
    cqmax: scu,
    /**
     * Percents (between 0 and 1)
     */
    perc,
    /**
     * Radius
     */
    rad: {
        s: 0.5,
        m: 1,
        l: 2
    },
    /**
     * Thickness
     */
    th: {
        s: 0.1,
        m: 0.25,
        l: 0.5
    },
    /**
     * Scale coefficients
     */
    sc: {
        xs: 0.5,
        s: 0.67,
        m: 1,
        l: 1.5,
        xl: 2
    },
    /**
     * Translate coefficients
     */
    tr: {
        xs: 0.25,
        s: 0.5,
        m: 1,
        l: 1.5,
        xl: 2
    },
    /**
     * Skew coefficients
     */
    sk: {
        xs: -15,
        s: -10,
        m: 0,
        l: 10,
        xl: 15
    },
    /**
     * Rotate coefficients
     */
    rot: {
        xs: -180,
        s: -90,
        m: 0,
        l: 90,
        xl: 180
    },
    /**
     * Zoom coefficients
     */
    zm: {
        s: 0.8,
        m: 1,
        l: 1.2
    },
    /**
     * Perspective coefficients
     */
    pers: {
        s: '100px',
        m: '200px'
    },
    /**
     * Font-size coefficients
     */
    fsz: {
        xs: 0.25,
        s: 0.5,
        m: 1,
        l: 1.5,
        xl: 2
    },
    /**
     * Line-height coefficients
     */
    lh: {
        xs: 1,
        s: 1.25,
        m: 1.5,
        l: 1.75,
        xl: 2
    },
    /**
     * Letter-spacing coefficients
     */
    lsp: {
        no: 0,
        s: 0.05,
        m: 0.1,
        l: 0.2
    },
    /**
     * Z-index coefficients
     */
    zi: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5
    },
    /**
     * Animation-iteration-count coefficients
     */
    ic: {
        inf: 'infinite',
        1: 1,
        2: 2
    },
    /**
     * Inset
     */
    ins: perc,
    /**
     * Universal
     */
    uni: {
        ini: 'initial',
        inh: INHERIT,
        u: 'unset',
        r: REVERT,
        rl: REVERT_LAYER
    },
    /**
     * Alignment
     */
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
    /**
     * Display
     */
    dis: {
        g: GRID,
        ig: INLINE_GRID,
        f: FLEX,
        if: INLINE_FLEX,
        b: BLOCK,
        i: INLINE
    },
    /**
     * Column amount
     */
    ca: coef,
    /**
     * Column offset
     */
    co: coef,
    /**
     * Row amount
     */
    ra: coef,
    /**
     * Row offset
     */
    ro: coef,
    /**
     * Flex-direction
     */
    fd: {
        r: ROW,
        rr: ROW_REVERSE,
        c: COLUMN,
        cr: COLUMN_REVERSE
    },
    /**
     * Flex-basis
     */
    fb: perc,
    /**
     * Flex-order
     */
    fo: coef,
    /**
     * Flex-grow
     */
    fg: coef,
    /**
     * Flex-shrink
     */
    fs: coef,
    /**
     * Flex-wrap
     */
    fw: {
        w: WRAP,
        nw: NOWRAP,
        wr: WRAP_REVERSE
    },
    /**
     * Repeat
     */
    rep: {
        rx: REPEAT_X,
        ry: REPEAT_Y,
        r: REPEAT,
        s: SPACE,
        ro: 'round',
        nr: NO_REPEAT
    },
    /**
     * Transition-timing-function
     */
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
    /**
     * Word-break
     */
    wb: {
        n: NORMAL,
        ba: BREAK_ALL,
        ka: KEEP_ALL,
        bw: BREAK_WORD
    },
    /**
     * Writting-mode
     */
    wm: {
        htb: HORIZONTAL_TB,
        vlr: VERTICAL_LR,
        vrl: VERTICAL_RL
    },
    /**
     * Hyphens
     */
    hyp: {
        no: NONE,
        m: MANUAL,
        a: AUTO
    },
    /**
     * Text-transform
     */
    tt: {
        l: LOWERCASE,
        u: UPPERCASE,
        c: CAPITALIZE
    },
    /**
     * Text-decoration
     */
    td: {
        lt: LINE_THROUGH,
        o: OVERLINE,
        u: UNDERLINE
    },
    /**
     * Text-orientation
     */
    tor: {
        m: 'mixed',
        u: 'upright',
        sr: 'sideways-right',
        s: 'sideways',
        ugo: 'use-glyph-' + ORIENTATION
    },
    /**
     * Text-align
     */
    ta: {
        l: LEFT,
        c: CENTER,
        j: JUSTIFY,
        r: RIGHT,
        s: START,
        e: END
    },
    /**
     * Transition-property
     */
    tp: {
        all: ALL,
        col: comma(COLOR, BACKGROUND_COLOR, BORDER_COLOR, TEXT_DECORATION_COLOR),
        icon: comma(FILL, STROKE),
        flt: comma(FILTER, BACKDROP_FILTER),
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
    /**
     * Line-break
     */
    lb: {
        a: AUTO,
        any: ANYWHERE,
        n: NORMAL,
        l: LOOSE,
        s: STRICT
    },
    /**
     * Overflow
     */
    ov: {
        h: HIDDEN,
        s: SCROLL,
        a: AUTO,
        c: CLIP,
        e: ELLIPSIS
    },
    /**
     * Visibility
     */
    v: {
        h: HIDDEN,
        v: VISIBLE,
        c: COLLAPSE,
        a: AUTO
    },
    /**
     * Will-change
     */
    wc: {
        a: AUTO,
        sp: SCROLL_POSITION,
        c: CONTENTS,
        tf: TRANSFORM,
        o: OPACITY,
        i: INSET,
        tfi: TRANSFORM + ',' + INSET
    },
    /**
     * Animation-fill-mode
     */
    afm: {
        no: NONE,
        f: FORWARDS,
        b: BACKWARDS,
        both: BOTH
    },
    /**
     * Animation-direction
     */
    adir: {
        r: REVERSE,
        a: ALTERNATE,
        ar: ALTERNATE_REVERSE
    },
    /**
     * Animation-play-state
     */
    aps: {
        r: RUNNING,
        p: PAUSED
    },
    /**
     * Transition-behavior
     */
    tb: {
        ad: ALLOW_DISCRETE,
        n: NORMAL
    },
    /**
     * Appearance
     */
    app: {
        n: NONE,
        a: AUTO
    },
    /**
     * Pointer-events
     */
    pe: {
        a: AUTO,
        no: NONE,
        all: ALL,
        f: FILL,
        s: STROKE
    },
    /**
     * Cursor
     */
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
    /**
     * Resize
     */
    res: {
        n: NONE,
        v: VERTICAL,
        h: HORIZONTAL,
        b: BOTH
    },
    /**
     * Touch-action
     */
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
    /**
     * User-select
     */
    us: {
        n: NONE,
        t: TEXT,
        all: ALL,
        a: AUTO
    },
    /**
     * Scroll-behavior
     */
    sb: {
        a: AUTO,
        s: SMOOTH
    },
    /**
     * Scroll-snap-stop
     */
    sss: {
        n: NORMAL,
        a: ALWAYS
    },
    /**
     * Scroll-snap-type
     */
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
    /**
     * Font-style
     */
    fst: {
        i: ITALIC,
        n: NORMAL,
        o: OBLIQUE
    },
    /**
     * Position
     */
    pos: {
        r: RELATIVE,
        a: ABSOLUTE,
        f: FIXED,
        s: STATIC
    },
    /**
     * Position value
     */
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
    /**
     * Content-size
     */
    csz: {
        cv: COVER,
        cn: CONTAIN,
        a: AUTO,
        f: FILL,
        sd: SCALE_DOWN
    },
    /**
     * Column-fill
     */
    cf: {
        a: AUTO,
        b: BALANCE
    },
    /**
     * Column-span
     */
    cs: {
        no: NONE,
        all: ALL
    },
    /**
     * Box-sizing
     */
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
    /**
     * Mask-composite
     */
    mcm: {
        a: ADD,
        s: SUBTRACT,
        i: INTERSECT,
        e: EXCLUDE
    },
    /**
     * Mask-type
     */
    mtp: {
        a: ALPHA,
        l: LUMINANCE
    },
    /**
     * Mask-mode
     */
    mm: {
        a: ALPHA,
        l: LUMINANCE,
        m: MATCH_SOURCE
    },
    /**
     * Background-blend-mode
     */
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
    /**
     * Background-att
     */
    bga: {
        s: SCROLL,
        f: FIXED,
        l: LOCAL
    },
    /**
     * Line-style
     */
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
    /**
     * Container-type
     */
    cnt: {
        n: NORMAL,
        s: SIZE,
        is: INLINE_SIZE
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
    trn: TRANSITION,
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
    csh: COLOR_SCHEME,
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
    pi: PLACE_ITEMS,
    ac: ALIGN_CONTENT,
    gtr: GRID_TEMPLATE_ROWS,
    gtc: GRID_TEMPLATE_COLUMNS,
    rg: ROW_GAP,
    cg: COLUMN_GAP,

    as: ALIGN_SELF,
    js: JUSTFY_SELF,
    gr: GRID_ROW,
    gre: GRID_ROW_END,
    grs: GRID_ROW_START,
    gc: GRID_COLUMN,
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
    fsn: FONT_SYNTHESIS,
    tt: TEXT_TRANSFORM,
    td: TEXT_DECORATION,
    ta: TEXT_ALIGN,
    to: TEXT_OVERFLOW,
    trg: TEXT_RENDERING,
    ts: TEXT_SHADOW,
    te: TEXT_EMPHASIS,
    tw: TEXT_WRAP,
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
    con: CONTENT,
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
    cnt: CONTAINER_TYPE,
    cnn: CONTAINER_NAME,
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
     * :focus-visible
     */
    fv_: ':focus-visible',
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
    /**
     * :required
     */
    rq_: ':required',
    /**
     * :optional
     */
    o_: ':optional',
    /**
     * :modal
     */
    m_: ':modal',
    /**
     * :link
     */
    l_: ':link',

    // collections

    /**
     * :first-child
     */
    fc_: COLON_FIRST + CHILD,
    /**
     * :last-child
     */
    lc_: COLON_LAST + CHILD,
    /**
     * :only-child
     */
    oc_: COLON_ONLY + CHILD,
    /**
     * :nth-child(odd)
     */
    odd_: NTH_CHILD + '(odd)',
    /**
     * :nth-child(even)
     */
    even_:  NTH_CHILD + '(even)',
    /**
     * :first-of-type
     */
    ft_: COLON_FIRST + OF_TYPE,
    /**
     * :last-of-type
     */
    lt_: COLON_LAST + OF_TYPE,
    /**
     * :only-of-type
     */
    ot_: COLON_ONLY + OF_TYPE,

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
    /**
     * &::before,&::after
     */
    ba_: '&::before,&::after',
    /**
     * :placeholder
     */
    pl_: ':placeholder',

    // media queries

    light_: AT_MEDIA + `(${PREFERS_COLOR_SCHEME}: light)`,
    dark_: AT_MEDIA + `(${PREFERS_COLOR_SCHEME}: dark)`,
    red_m_: AT_MEDIA + '(prefers-reduced-motion: reduce)',
    ori_l_: AT_MEDIA + `(${ORIENTATION}: landscape)`,
    ori_p_: AT_MEDIA + `(${ORIENTATION}: portrait)`,
    gam_srgb_: AT_MEDIA + `(${COLOR_GAMUT}: srgb)`,
    gam_p3_: AT_MEDIA + `(${COLOR_GAMUT}: p3)`,
    gam_rec_: AT_MEDIA + `(${COLOR_GAMUT}: rec2020)`,
    con_no_: AT_MEDIA + `(${PREFERS_CONTRAST}: no-preference)`,
    con_m_: AT_MEDIA + `(${PREFERS_CONTRAST}: more)`,
    con_l_: AT_MEDIA + `(${PREFERS_CONTRAST}: less)`,
    con_c_: AT_MEDIA + `(${PREFERS_CONTRAST}: custom)`,
    scr_no_: AT_MEDIA + `(${SCRIPTING}: none)`,
    scr_ini_: AT_MEDIA + `(${SCRIPTING}: initial-only)`,
    scr_en_: AT_MEDIA + `(${SCRIPTING}: enabled)`,
};

export type IGlobalValues = typeof values;
export type IGlobalKeys = typeof keys;
