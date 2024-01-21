export const InputActions = {
  left: ['KeyA', 'ArrowLeft'],
  up: ['KeyW', 'ArrowUp'],
  right: ['KeyD', 'ArrowRight'],
  down: ['KeyS', 'ArrowDown'],
} as const;

export type InputAction = keyof typeof InputActions;
type InputCode<Action extends InputAction = InputAction> =
  (typeof InputActions)[Action][number];

export class InputManager {
  #map = new Map<InputAction, boolean>();
  #codeMap = new Map<InputCode, InputAction>();

  public registerActions(): void {
    // Init code lookup maps
    for (const [action, codes] of Object.entries(InputActions)) {
      this.#map.set(action as InputAction, false);
      codes.forEach((code) => this.#codeMap.set(code, action as InputAction));
    }

    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('keyup', this.#handleKeyUp);

    const actions = Object.keys(InputActions);
    actions.forEach((act) => this.#map.set(act as InputAction, false));
  }

  public getActionActive(action: InputAction): boolean {
    return this.#map.get(action) ?? false;
  }

  #handleKeyDown = (ev: KeyboardEvent) => {
    const code = this.#codeMap.get(ev.code as InputCode);
    if (!code) {
      return;
    }

    this.#map.set(code, true);
  };

  #handleKeyUp = (ev: KeyboardEvent) => {
    const code = this.#codeMap.get(ev.code as InputCode);
    if (!code) {
      return;
    }

    this.#map.set(code, false);
  };
}
