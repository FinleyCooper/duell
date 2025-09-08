# Precompute Duell dice orientations and nextState lookup table in TypeScript format

faces = [1, 2, 3, 4, 5, 6]
opposite = {1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1}

# Generate all 24 orientations: (top, front, right)
orientations = []
for top in faces:
    for front in faces:
        if front == top or front == opposite[top]:
            continue
        # find a valid right face (not top, front, or opposites)
        for right in faces:
            if right in [top, front, opposite[top], opposite[front]]:
                continue
            orientations.append((top, front, right))

# Print in TypeScript array format
print("export const orientations: [number, number, number][] = [")
for o in orientations:
    print(f"  [{o[0]}, {o[1]}, {o[2]}],")
print("];\n")

# Function to roll a die in a direction
def roll_once(top, front, right, dir):
    # dir: 0=N, 1=E, 2=S, 3=W
    if dir == 0:   # North
        return (front, opposite[top], right)
    elif dir == 2: # South
        return (opposite[front], top, right)
    elif dir == 1: # East
        return (opposite[right], front, top)
    elif dir == 3: # West
        return (right, front, opposite[top])
    else:
        raise ValueError("Invalid direction")

# Generate nextState lookup (24*4 = 96 entries)
nextState = []
for idx, (top, front, right) in enumerate(orientations):
    for dir in range(4):
        new_top, new_front, new_right = roll_once(top, front, right, dir)
        # find the index of this new orientation
        new_idx = orientations.index((new_top, new_front, new_right))
        nextState.append(new_idx)

# Print nextState in TypeScript array format
print("export const nextState: number[] = [")
for i in range(0, len(nextState), 8):
    # print 8 entries per line for readability
    line = ", ".join(str(x) for x in nextState[i:i+8])
    print("  " + line + ",")
print("];")
