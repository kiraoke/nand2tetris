// MULTIPLIES R0 AND R1

(LOOP)
@R0
// GETS R0
D=M
@R2
// THE RESULT OF MULTIPLICATION IS IN R2
M=D+M
// R3 KEEPS TRACK OF NUMBER OF TIMES REPEATED ADDITION IS PERFORMED
@R3
D=M
M=D+1
D=M

@R1
D=D-M
// IF R3 EQUALS R1 THEN REPEATED ADDITION IS COMPLETED AND BREAK OFF
@END
D;JEQ

// ELSE LOOP BACK
@LOOP
0;JMP


(END)
@END
0;JMP
