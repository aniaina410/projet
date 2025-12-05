SELECT
    a.table_name AS table_with_fk,
    a.column_name AS fk_column,
    c_pk.table_name AS referenced_table,
    b.column_name AS referenced_column
FROM
    user_cons_columns a
JOIN
    user_constraints c_fk ON a.constraint_name = c_fk.constraint_name
JOIN
    user_constraints c_pk ON c_fk.r_constraint_name = c_pk.constraint_name
JOIN
    user_cons_columns b ON c_pk.constraint_name = b.constraint_name AND a.position = b.position
WHERE
    c_fk.constraint_type = 'R'
ORDER BY
    a.table_name;
